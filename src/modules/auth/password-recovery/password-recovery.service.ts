import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { MailService } from '@root/modules/libs/mail/mail.service';
import { Request } from 'express';
import { TResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from '@root/shared/utils/generate-token.util';
import { TokenType } from '@prisma/prisma/enums';
import { getSessionMetadata } from '@root/shared/utils/session-metadata.util';
import { TNewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';
import { TelegramService } from '@root/modules/libs/telegram/telegram.service';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly telegram: TelegramService,
  ) { }

  async resetPassword(req: Request, input: TResetPasswordInput, userAgent: string) {
    const { email } = input

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { notificationSettings: true }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    const resetToken = await generateToken(this.prisma, user, TokenType.RESET_PASSWORD)

    const metadata = getSessionMetadata(req, userAgent)
    
    // await this.mail.sendResetPasswordToken(user.email, resetToken.token, metadata)

    if (resetToken.user.notificationSettings?.telegramNotifications && resetToken.user.telegramId) {
      await this.telegram.sendPasswordResetToken(resetToken.user.telegramId, resetToken.token, metadata)
    }
    
    return true
  }

  async newPassword(input: TNewPasswordInput) {
    const { password, token } = input

    const existingToken = await this.prisma.token.findUnique({ where: { token, type: TokenType.RESET_PASSWORD } })

    if (!existingToken) {
      throw new NotFoundException('Токен не найден')
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date()

    if (isExpired) {
      throw new BadRequestException('Токен истёк')
    }

    const hashPassword = await hash(password)

    await this.prisma.user.update({ where: { id: existingToken.userId }, data: { password: hashPassword } })

    await this.prisma.token.delete({ where: { id: existingToken.id, type: TokenType.RESET_PASSWORD } })

    return true
  }
}
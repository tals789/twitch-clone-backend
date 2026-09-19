import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/prisma/client';
import { TokenType } from '@prisma/prisma/enums';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { MailService } from '@root/modules/libs/mail/mail.service';
import { generateToken } from '@root/shared/utils/generate-token.util';
import { getSessionMetadata } from '@root/shared/utils/session-metadata.util';
import { destroySession, saveSession } from '@root/shared/utils/session.util';
import { Request } from 'express';
import { TDeactivateAccountInput } from './inputs/deactivate-account.input';
import { verify } from 'argon2';
import { TelegramService } from '@root/modules/libs/telegram/telegram.service';

@Injectable()
export class DeactivateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly telegram: TelegramService,
  ) { }

  private async validateDeactivateToken(req: Request, token: string) {
    const existingToken = await this.prisma.token.findUnique({ where: { token, type: TokenType.DEACTIVATE_ACCOUNT } })

    if (!existingToken) {
      throw new NotFoundException('Токен не найден')
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date()

    if (isExpired) {
      throw new BadRequestException('Токен истёк')
    }

    await this.prisma.user.update({ where: { id: existingToken.userId }, data: { isDeactivated: true, deactivatedAt: new Date() } })

    await this.prisma.token.delete({ where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT } })

    return destroySession(req, this.config)
  }

  async sendDeactivateToken(
    req: Request,
    user: User,
    userAgent: string
  ) {
    const deactivateToken = await generateToken(this.prisma, user, TokenType.DEACTIVATE_ACCOUNT, false)

    const metadata = getSessionMetadata(req, userAgent)
    
    // await this.mail.sendDeactivateToken(user.email, deactivateToken.token, metadata)

    if (deactivateToken.user.notificationSettings && deactivateToken.user.telegramId) {
      await this.telegram.sendDeactivateAccountToken(deactivateToken.user.telegramId, deactivateToken.token)

      await this.telegram.sendAccountDeletion(deactivateToken.user.telegramId)
    }

    return true 
  }

  async deactivate(
    req: Request,
    input: TDeactivateAccountInput,
    user: User,
    userAgent: string
  ) {
    const { email, password, pin } = input

    if (user.email !== email) {
      throw new BadRequestException('Неверная почта или пароль')
    }

    const isPasswordCorrect = await verify(user.password, password)

    if (!isPasswordCorrect) {
      throw new BadRequestException('Неверная почта или пароль')
    }

    if (!pin) {
      await this.sendDeactivateToken(req, user, userAgent)

      return { message: 'Требуется код подтверждения' }
    }

    await this.validateDeactivateToken(req, pin)

    return { user }
  }
}
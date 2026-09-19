import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { MailService } from '@root/modules/libs/mail/mail.service';
import { Request } from 'express';
import { TVerificationInput } from './inputs/verification.input';
import { TokenType } from '@prisma/prisma/enums';
import { getSessionMetadata } from '@root/shared/utils/session-metadata.util';
import { saveSession } from '@root/shared/utils/session.util';
import { User } from '@prisma/prisma/client';
import { generateToken } from '@root/shared/utils/generate-token.util';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) { }

  async verify(req: Request, input: TVerificationInput, userAgent: string) {
    const { token } = input

    const existingToken = await this.prisma.token.findUnique({ where: { token, type: TokenType.EMAIL_VERIFY } })

    if (!existingToken) {
      throw new NotFoundException('Токен не найден')
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date()

    if (isExpired) {
      throw new BadRequestException('Токен истёк')
    }

    const user = await this.prisma.user.update({ where: { id: existingToken.userId }, data: { isEmailVerified: true } })

    await this.prisma.token.delete({ where: { id: existingToken.id, type: TokenType.EMAIL_VERIFY } })

    const metadata = getSessionMetadata(req, userAgent)

    return saveSession(req, user, metadata)
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await generateToken(this.prisma, user, TokenType.EMAIL_VERIFY)

    await this.mail.sendVerificationToken(user.email, verificationToken.token)
    
    return true
  }

  
}
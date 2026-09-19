import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerificationTemplate } from './templates/verification.template';
import { ResetPasswordTemplate } from './templates/password-recovery.template';
import { ISessionMetadata } from '@root/shared/types/session-metadata.type';
import { DeactivateAccountTemplate } from './templates/deactivate.template';
import { AccountDeletionTemplate } from './templates/account-deletion.template';
import { EnableTwoFactorTemplate } from './templates/enable-two-factore.template';
import { VerifyChannelTemplate } from './templates/verify-channel.template';

@Injectable()
export class MailService {
  constructor(
    private readonly config: ConfigService,
    private readonly mail: MailerService
  ) { }

  private sendMail(email: string, subject: string, html: string) {
    return this.mail.sendMail({
      to: email,
      subject,
      html
    })
  }

  async sendVerificationToken(email: string, token: string) {
    const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(VerificationTemplate({ domain, token }))

    return this.sendMail(email, 'Верификация аккаунта', html)
  }

  async sendResetPasswordToken(email: string, token: string, metadata: ISessionMetadata) {
    const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ResetPasswordTemplate({ domain, token, metadata }))

    return this.sendMail(email, 'Сброс пароля', html)
  }

  async sendDeactivateToken(email: string, token: string, metadata: ISessionMetadata) {
    const html = await render(DeactivateAccountTemplate({ token, metadata }))

    return this.sendMail(email, 'Деактивация аккаунта', html)
  }

  async sendAccountDeletion(email: string) {
    const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(AccountDeletionTemplate({ domain }))

    return this.sendMail(email, 'Аккаунт удалён', html)
  }

  async sendEnableTwoFactor(email: string) {
    const html = await render(EnableTwoFactorTemplate())

    return this.sendMail(email, 'Активация двухфакторной аутентификации', html)
  }

  async sendVerifyChannel(email: string) {
    const html = await render(VerifyChannelTemplate())

    return this.sendMail(email, 'Ваш канал верифицирован', html)
  }
}
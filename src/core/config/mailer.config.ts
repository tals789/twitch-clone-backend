import { ConfigService } from "@nestjs/config";
import { MailerOptions } from '@nestjs-modules/mailer'

export const getMailerConfig = (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.getOrThrow<string>('MAIL_HOST'),
    port: config.getOrThrow<number>('MAIL_PORT'),
    secure: false,
    auth: {
      user: config.getOrThrow<string>('MAIL_LOGIN'),
      pass: config.getOrThrow<string>('MAIL_PASS'),
    }
  },
  defaults: {
    from: `"TwitchClone" ${config.getOrThrow<string>('MAIL_LOGIN')}`
  }
})
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '@root/core/config/mailer.config';

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getMailerConfig
  })],
  providers: [MailService],
  exports: [MailService]
})
@Global()  
export class MailModule {}

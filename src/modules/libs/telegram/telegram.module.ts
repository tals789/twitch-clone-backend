import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTelegrafConfig } from '@root/core/config/telegraf.config';

@Module({
  imports: [TelegrafModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: getTelegrafConfig,
    inject: [ConfigService]
  })],
  providers: [TelegramService],
})
export class TelegramModule {}

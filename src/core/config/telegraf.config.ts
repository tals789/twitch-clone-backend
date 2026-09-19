import { ConfigService } from "@nestjs/config";
import { TelegrafModuleOptions } from 'nestjs-telegraf'

export const getTelegrafConfig = (config: ConfigService): TelegrafModuleOptions => ({
  token: config.getOrThrow<string>('TG_BOT_TOKEN')
})
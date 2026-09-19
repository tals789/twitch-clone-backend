import { ConfigService } from "@nestjs/config";
import { ILiveKitOptions } from "@root/modules/libs/livekit/types/livekit.type";

export const getLiveKitConfig = (config: ConfigService): ILiveKitOptions => ({
  apiUrl: config.getOrThrow<string>('LIVEKIT_URL'),
  apiKey: config.getOrThrow<string>('LIVEKIT_API_KEY'),
  apiSecret: config.getOrThrow<string>('LIVEKIT_API_SECRET'),
})
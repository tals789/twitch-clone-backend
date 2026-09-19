import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { RawBodyMiddleware } from '@root/shared/middlewares/raw-body.middleware';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService, TelegramService],
})
export class WebhookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST })
  }
}
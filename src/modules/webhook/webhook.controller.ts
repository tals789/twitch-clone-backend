import { Body, Controller, Headers, Post, RawBody, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post('livekit')
  async receiveWebhookLivekit(
    @Body() body: string,
    @Headers('Authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('Отсутствует заголовок авторизации')
    }

    return this.webhookService.receiveWebhookLivekit(body, auth)
  }

  @Post('stripe')
  async receiveWebhookStripe(@RawBody() rawBody: string, @Headers('stripe-signature') sig: string) {
    if (!sig) throw new UnauthorizedException('Отсутствует подпись Stripe в заголовке')

    const event = await this.webhookService.constructStripeEvent(rawBody, sig)

    await this.webhookService.receiveWebhookStripe(event)
  }
}
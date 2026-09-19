import { ConfigService } from "@nestjs/config";
import { IStripeOptions } from "@root/modules/libs/stripe/types/stripe.type";

export const getStripeConfig = (config: ConfigService): IStripeOptions => ({
  apiKey: config.getOrThrow<string>('STRIPE_SECRET_KEY'),
  config: {
    apiVersion: '2026-08-26.dahlia'
  }
})
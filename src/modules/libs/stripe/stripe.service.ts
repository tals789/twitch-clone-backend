import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe'
import { type IStripeOptions, StripeOptionsSymbol } from './types/stripe.type';

@Injectable()
export class StripeService extends Stripe {
  constructor(@Inject(StripeOptionsSymbol) private readonly options: IStripeOptions) {
    super(options.apiKey, options.config)
  }
}
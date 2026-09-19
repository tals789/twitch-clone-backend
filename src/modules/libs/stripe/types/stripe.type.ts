import { FactoryProvider, ModuleMetadata } from "@nestjs/common"
import Stripe from 'stripe'

export const StripeOptionsSymbol = Symbol('StripeOptionsSymbol')

export interface IStripeOptions {
  apiKey: string
  config?: Stripe.StripeConfig
}

export type TStripeAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<IStripeOptions>, 'useFactory' | 'inject'>
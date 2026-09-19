import { DynamicModule, Module } from '@nestjs/common';
import { IStripeOptions, StripeOptionsSymbol, TStripeAsyncOptions } from './types/stripe.type';
import { StripeService } from './stripe.service';

@Module({})
export class StripeModule {
  static register(options: IStripeOptions): DynamicModule {
    return {
      module: StripeModule,
      providers: [
        {
          provide: StripeOptionsSymbol,
          useValue: options
        },
        StripeService
      ],
      exports: [StripeService],
      global: true
    }
  }

  static registerAsync(options: TStripeAsyncOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: options.imports || [],
      providers: [
        {
          provide: StripeOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        StripeService
      ],
      exports: [StripeService],
      global: true
    }
  }
}
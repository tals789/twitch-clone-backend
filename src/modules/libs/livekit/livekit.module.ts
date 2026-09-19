import { DynamicModule, Module } from '@nestjs/common';
import { ILiveKitOptions, LiveKitOptionsSymbol, TLiveKitAsyncOptions } from './types/livekit.type';
import { LivekitService } from './livekit.service';

@Module({})
export class LivekitModule {
  static register(options: ILiveKitOptions): DynamicModule {
    return {
      module: LivekitModule,
      providers: [
        {
          provide: LiveKitOptionsSymbol,
          useValue: options
        },
        LivekitService
      ],
      exports: [LivekitService],
      global: true
    }
  }

  static registerAsync(options: TLiveKitAsyncOptions): DynamicModule {
    return {
      module: LivekitModule,
      imports: options.imports || [],
      providers: [
        {
          provide: LiveKitOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        LivekitService
      ],
      exports: [LivekitService],
      global: true
    }
  }
}
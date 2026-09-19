import { FactoryProvider, ModuleMetadata } from "@nestjs/common"

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol')

export interface ILiveKitOptions {
  apiUrl: string
  apiKey: string
  apiSecret: string
}

export type TLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<ILiveKitOptions>, 'useFactory' | 'inject'>
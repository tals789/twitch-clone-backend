import { Inject, Injectable } from '@nestjs/common';
import { RoomServiceClient, IngressClient, WebhookReceiver } from 'livekit-server-sdk'
import { type ILiveKitOptions, LiveKitOptionsSymbol } from './types/livekit.type';

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient
  private ingressClient: IngressClient
  private webhook: WebhookReceiver

  constructor(
    @Inject(LiveKitOptionsSymbol) private readonly options: ILiveKitOptions
  ) {
    this.roomService = new RoomServiceClient(
      this.options.apiUrl,
      this.options.apiKey,
      this.options.apiSecret,
    )

    this.ingressClient = new IngressClient(
      this.options.apiUrl,
    )

    this.webhook = new WebhookReceiver(
      this.options.apiKey,
      this.options.apiSecret,
    )
  }

  get ingress(): IngressClient {
    return this.createProxy(this.ingressClient)
  }

  get room(): RoomServiceClient {
    return this.createProxy(this.roomService)
  }

  get receiver(): WebhookReceiver {
    return this.createProxy(this.webhook)
  }

  private createProxy<T extends object>(target: T) {
    return new Proxy(target, {
      get: (obj, prop) => {
        const value = obj[prop as keyof T]

        if (typeof value === 'function') return value.bind(obj)

        return value
      }
    })
  }
}
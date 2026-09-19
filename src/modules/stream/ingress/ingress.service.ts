import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { LivekitService } from '@root/modules/libs/livekit/livekit.service';
import { CreateIngressOptions, IngressAudioEncodingPreset, IngressInput, IngressVideoEncodingPreset } from 'livekit-server-sdk';

@Injectable()
export class IngressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly livekit: LivekitService,
  ) { }

  async create(user: User, ingressType: IngressInput) {
    await this.resetIngresses(user)

    const options: CreateIngressOptions = {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id,
    }

    if (ingressType === IngressInput.WHIP_INPUT) {
      options.bypassTranscoding = true
    } else {
      options.video = {
        source: 1,
        preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
      }
      options.audio = {
        source: 2,
        preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
      }
    }

    const ingress = await this.livekit.ingress.createIngress(ingressType, options)

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new BadRequestException('Не удалось создать входной поток')
    }

    await this.prisma.stream.update({
      where: {
        userId: user.id
      },
      data: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey
      }
    })

    return true
  }

  private async resetIngresses(user: User) {
    const ingresses = await this.livekit.ingress.listIngress({
      roomName: user.id
    })

    const rooms = await this.livekit.room.listRooms([user.id])

    for (const room of rooms) {
      await this.livekit.room.deleteRoom(room.name)
    }

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await this.livekit.ingress.deleteIngress(ingress.ingressId)
      }
    }
  }
}
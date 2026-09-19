import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { TSendMessageInput } from './inputs/send-message.input';
import { User } from '@prisma/prisma/client';
import { TChangeChatSettingsInput } from './inputs/change-chat-setting.input';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }

  async getMessagesByStream(streamId: string) {
    return await this.prisma.chatMessage.findMany({
      where: { streamId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  }

  async sendMessage(
    userId: string,
    input: TSendMessageInput
  ) {
    const { text, streamId } = input

    const stream = await this.prisma.stream.findUnique({
      where: { id: streamId }
    })

    if (!stream) {
      throw new NotFoundException('Стрим не найден')
    }

    if (!stream.isLive) {
      throw new BadRequestException('Стрим не в режиме живого вещания')
    }

    return await this.prisma.chatMessage.create({
      data: {
        text,
        user: { connect: { id: userId } },
        stream: { connect: { id: stream.id } }
      },
      include: { stream: true, user: true }
    })
  }

  async changeSettings(user: User, input: TChangeChatSettingsInput) {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } = input

    await this.prisma.stream.update({
      where: { userId: user.id },
      data: { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly }
    })

    return true
  }
}
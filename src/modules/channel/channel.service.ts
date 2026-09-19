import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) { }

  async getRecommendedChannels() {
    return await this.prisma.user.findMany({
      where: { isDeactivated: false },
      orderBy: { followings: { _count: 'desc' } },
      include: { stream: true },
      take: 7
    })
  }

  async getByUsername(username: string) {
    const channel = await this.prisma.user.findUnique({
      where: { username, isDeactivated: false },
      include: { socialLinks: { orderBy: { position: 'asc' } }, stream: { include: { category: true } }, followings: { include: { follower: true } } }
    })

    if (!channel) throw new NotFoundException('Канал не найден')

    return channel
  }

  async getFollowersCountByChannel(channelId: string) {
    return await this.prisma.follow.count({
      where: { following: { id: channelId } }
    })
  }

  async getSponsorsByChannel(channelId: string) {
    const existingChannel = await this.prisma.user.findUnique({
      where: { id: channelId } 
    })

    if(!existingChannel) throw new NotFoundException('Канал не найден')
    
    return await this.prisma.sponsorshipSubscription.findMany({
      where: { channelId: existingChannel.id },
      orderBy: { createdAt: 'desc' },
      include: { plan: true, user: true, channel: true }
    })
  }
}
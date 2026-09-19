import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Injectable()
export class FollowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
    private readonly telegram: TelegramService,
  ) { }

  async getMyFollowers(user: User) {
    return await this.prisma.follow.findMany({
      where: { followingId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { follower: true }
    })
  }

  async getMyFollowings(user: User) {
    return await this.prisma.follow.findMany({
      where: { followerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { following: true }
    })
  }

  async follow(user: User, channelId: string) {
    const channel = await this.prisma.user.findUnique({
      where: { id: channelId }
    })

    if (!channel) throw new NotFoundException('Канал не найден')

    if (channel.id === user.id) throw new ConflictException('Нельзя подписаться на себя')

    const existingFollow = await this.prisma.follow.findFirst({
      where: { followerId: user.id, followingId: channel.id }
    })

    if (existingFollow) throw new ConflictException('Вы уже подписаны на этот канал')

    const follow = await this.prisma.follow.create({
      data: { followerId: user.id, followingId: channel.id },
      include: { follower: true, following: { include: { notificationSettings: true } } }
    })

    if (follow.following.notificationSettings?.siteNotifications) {
      await this.notification.createNewFollowing(follow.following.id, follow.follower)
    }

    if (follow.following.notificationSettings?.telegramNotifications && follow.following.telegramId) {
      await this.telegram.sendNewFollower(follow.following.telegramId, follow.follower)
    }

    return true
  }

  async unfollow(user: User, channelId: string) {
    const channel = await this.prisma.user.findUnique({
      where: { id: channelId }
    })

    if (!channel) throw new NotFoundException('Канал не найден')

    if (channel.id === user.id) throw new ConflictException('Нельзя отписаться от себя')

    const existingFollow = await this.prisma.follow.findFirst({
      where: { followerId: user.id, followingId: channel.id }
    })

    if (!existingFollow) throw new ConflictException('Вы не подписаны на этот канал')

    await this.prisma.follow.delete({
      where: { id: existingFollow.id, followerId: user.id, followingId: channel.id }
    })

    return true
  }
}
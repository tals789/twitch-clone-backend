import { Injectable } from '@nestjs/common';
import { NotificationType, SponsorshipPlan, TokenType, User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { TChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input';
import { generateToken } from '@root/shared/utils/generate-token.util';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  async getUnreadCount(user: User) {
    return await this.prisma.notification.count({
      where: { isRead: false, userId: user.id }
    })
  }

  async getByUser(user: User) {
    await this.prisma.notification.updateMany({
      where: { isRead: false, userId: user.id },
      data: { isRead: true }
    })

    return await this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
  }

  async changeSettings(user: User, input: TChangeNotificationsSettingsInput) {
    const { siteNotifications, telegramNotifications } = input
    
    const notificationsSettings = await this.prisma.notificationSetting.upsert({
      where: { userId: user.id },
      create: { siteNotifications, telegramNotifications, user: { connect: { id: user.id } } },
      update: { siteNotifications, telegramNotifications },
      include: { user: true }
    })


    if (notificationsSettings.telegramNotifications && !notificationsSettings.user.telegramId) {
      const telegramAuthToken = await generateToken(this.prisma, user, TokenType.TELEGRAM_AUTH)
      
      return {
        notificationsSettings,
        telegramAuthToken: telegramAuthToken.token
      }
    }

    if (!notificationsSettings.telegramNotifications && notificationsSettings.user.telegramId) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { telegramId: null }
      })

      return { notificationsSettings }
    }

    return { notificationsSettings }
  }

  async createStreamStart(userId: string, channel: User) {
    return await this.prisma.notification.create({
      data: {
        message: `<b className='font-medium'>Не пропустите!</b> <p>Присоединяйтесь к стриму на канале <a href='/${channel.username}' className='font-semibold'>${channel.displayName}</a></p>`,
        type: NotificationType.STREAM_START,
        user: { connect: { id: userId } }
      }
    })
  }

  async createNewFollowing(userId: string, follower: User) {
    return await this.prisma.notification.create({
      data: {
        message: `<b className='font-medium'>У вас новый подписчик!</b> <p>Это пользователь <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a></p>`,
        type: NotificationType.NEW_FOLLOWER,
        user: { connect: { id: userId } }
      }
    })
  }

  async createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User) {
    return await this.prisma.notification.create({
      data: {
        message: `<b className='font-medium'>У вас новый спонсор!</b> <p>Пользователь <a href='/${sponsor.username}' className='font-semibold'>${sponsor.displayName}</a> стал вашим спонсором, выбрав план ${plan.title}</p>`,
        type: NotificationType.NEW_SPONSORSHIP,
        user: { connect: { id: userId } }
      }
    })
  }

  async createEnableTwoFactor(userId: string) {
    return await this.prisma.notification.create({
      data: {
        message: 'Включите двухфакторную аутентификацию',
        type: NotificationType.ENABLE_TWO_FACTOR,
        userId
      }
    })
  }

  async createVerifyChannel(userId: string) {
    return await this.prisma.notification.create({
      data: {
        message: 'Поздравляем!. Ваш канал верифицирован, и вы получили официальный значок',
        type: NotificationType.VERIFIED_CHANNEL,
        userId
      }
    })
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StorageService } from '../libs/storage/storage.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CronService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly storage: StorageService,
    private readonly telegram: TelegramService,
    private readonly notification: NotificationService,
  ) { }

  // @Cron('*/10 * * * * *')
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteDeactivateAccount() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7)

    const deactivatedAccounts = await this.prisma.user.findMany({ where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } }, include: { notificationSettings: true, stream: true } })

    for (const user of deactivatedAccounts) {
      await this.mail.sendAccountDeletion(user.email)

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        await this.telegram.sendAccountDeletion(user.telegramId)
      }

      if (user.avatar) {
        await this.storage.remove(user.avatar!)
      }
      
      if (user.stream?.thumbnailUrl) {
        await this.storage.remove(user.stream?.thumbnailUrl!)
      }
    }

    await this.prisma.user.deleteMany({ where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } } })
  }

  @Cron(CronExpression.EVERY_WEEK)
  async notifyUserEnableTwoFactor() {
    const users = await this.prisma.user.findMany({
      where: { isTOTPEnabled: false },
      include: { notificationSettings: true }
    })

    for (const user of users) {
      // await this.mail.sendEnableTwoFactor(user.email)

      if (user.notificationSettings?.siteNotifications) {
        await this.notification.createEnableTwoFactor(user.id)
      }

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        await this.telegram.sendEnableTwoFactor(user.telegramId)
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async notifyVerifyChannel() {
    const users = await this.prisma.user.findMany({
      include: { notificationSettings: true }
    })

    for (const user of users) {
      const followersCount = await this.prisma.follow.count({
        where: { followingId: user.id }
      })

      if (followersCount > 10 && !user.isVerified) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true }
        })

        // await this.mail.sendVerifyChannel(user.email)
  
        if (user.notificationSettings?.siteNotifications) {
          await this.notification.createVerifyChannel(user.id)
        }
  
        if (user.notificationSettings?.telegramNotifications && user.telegramId) {
          await this.telegram.sendVerifyChannel(user.telegramId)
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteOldNotifications() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    await this.prisma.notification.deleteMany({
      where: { createdAt: { lte: sevenDaysAgo }}
    })
  }
}

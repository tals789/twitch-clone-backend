import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { ChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input';
import { ChangeNotificationsSettingsResponse } from './models/notification-settings.model';
import { NotificationModel } from './models/notification.model';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) { }

  @Query(() => Number, { name: 'getUnreadCountNotifications' })
  @Auth()
  async getUnreadCount(@Authorized() user: User) {
    return await this.notificationService.getUnreadCount(user)
  }

  @Query(() => [NotificationModel], { name: 'getNotificationsByUser' })
  @Auth()
  async getByUser(@Authorized() user: User) {
    return await this.notificationService.getByUser(user)
  }

  @Mutation(() => ChangeNotificationsSettingsResponse, { name: 'changeNotificationSettings' })
  @Auth()
  async changeSettings(@Authorized() user: User, @Args('data') input: ChangeNotificationsSettingsInput) {
    return await this.notificationService.changeSettings(user, input)
  }
}
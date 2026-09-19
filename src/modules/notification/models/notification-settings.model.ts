import { Field, ObjectType } from "@nestjs/graphql";
import { NotificationSetting } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";

@ObjectType()
export class NotificationSettingsModel implements NotificationSetting {
  @Field(() => String)
  id: string

  @Field(() => Boolean)
  siteNotifications: boolean

  @Field(() => Boolean)
  telegramNotifications: boolean

  @Field(() => String)
  userId: string;
  
  @Field(() => UserModel)
  user: UserModel

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType()
export class ChangeNotificationsSettingsResponse {
  @Field(() => NotificationSettingsModel)
  notificationsSettings: NotificationSettingsModel

  @Field(() => String, { nullable: true })
  telegramAuthToken?: string
}
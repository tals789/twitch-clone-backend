import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "@prisma/prisma/client";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "@root/modules/stream/models/stream.model";
import { FollowModel } from "@root/modules/follow/models/follow.model";
import { NotificationSettingsModel } from "@root/modules/notification/models/notification-settings.model";
import { NotificationModel } from "@root/modules/notification/models/notification.model";

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string

  @Field(() => String)
  username!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  avatar!: string | null

  @Field(() => String, { nullable: true })
  bio!: string | null

  @Field(() => Boolean)
  isEmailVerified!: boolean;

  @Field(() => Boolean)
  isVerified!: boolean;

  @Field(() => Boolean)
  isTOTPEnabled!: boolean;

  @Field(() => String, { nullable: true })
  totpSecret!: string;

  @Field(() => Boolean)
  isDeactivated!: boolean;

  @Field(() => Date, { nullable: true })
  deactivatedAt!: Date

  @Field(() => [SocialLinkModel])
  socialLinks: SocialLinkModel[]

  @Field(() => StreamModel)
  stream: StreamModel

  @Field(() => [FollowModel])
  followers: FollowModel

  @Field(() => [FollowModel])
  followings: FollowModel[]

  @Field(() => String, { nullable: true })
  telegramId: string

  @Field(() => [NotificationModel])
  notifications: NotificationModel[]

  @Field(() => NotificationSettingsModel)
  notificationSettings: NotificationSettingsModel

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
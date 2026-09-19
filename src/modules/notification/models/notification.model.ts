import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Notification, NotificationType } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";

registerEnumType(NotificationType, { name: 'NotificationType' })

@ObjectType()
export class NotificationModel implements Notification {
  @Field(() => String)
  id: string

  @Field(() => String)
  message: string

  @Field(() => NotificationType)
  type: NotificationType

  @Field(() => Boolean)
  isRead: boolean;
  
  @Field(() => String)
  userId: string;
  
  @Field(() => UserModel)
  user: UserModel

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Stream, User } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";
import { CategoryModel } from "@root/modules/category/models/category.model";
import { ChatMessageModel } from "@root/modules/chat/models/chat-message.model";

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  thumbnailUrl: string;

  @Field(() => String, { nullable: true })
  ingressId: string;

  @Field(() => String, { nullable: true })
  serverUrl: string;

  @Field(() => String, { nullable: true })
  streamKey: string;

  @Field(() => Boolean)
  isLive: boolean;

  @Field(() => String)
  userId: string;

  @Field(() => UserModel)
  user: UserModel

  @Field(() => String)
  categoryId: string | null;

  @Field(() => CategoryModel)
  category: CategoryModel

  @Field(() => Boolean)
  isChatEnabled!: boolean

  @Field(() => Boolean)
  isChatFollowersOnly!: boolean

  @Field(() => Boolean)
  isChatPremiumFollowersOnly!: boolean

  @Field(() => [ChatMessageModel])
  chatMessages: ChatMessageModel[]
  
  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}

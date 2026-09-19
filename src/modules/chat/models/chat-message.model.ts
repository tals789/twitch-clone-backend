import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ChatMessage, Stream, User } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";
import { StreamModel } from "@root/modules/stream/models/stream.model";

@ObjectType()
export class ChatMessageModel implements ChatMessage {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  text: string;

  @Field(() => String)
  userId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => String)
  streamId: string;

  @Field(() => StreamModel)
  stream: StreamModel;

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}

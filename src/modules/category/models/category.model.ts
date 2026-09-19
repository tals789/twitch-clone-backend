import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Category, Stream, User } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";
import { StreamModel } from "@root/modules/stream/models/stream.model";

@ObjectType()
export class CategoryModel implements Category {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  thumbnailUrl!: string

  @Field(() => String, { nullable: true })
  description: string | null

  @Field(() => String)
  slug!: string

  @Field(() => [StreamModel])
  streams!: StreamModel[]
  
  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TOTPModel {
  @Field(() => String)
  qrcodeUrl!: string

  @Field(() => String)
  secret!: string
}
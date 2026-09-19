import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SponsorshipPlan } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";

@ObjectType()
export class PlanModel implements SponsorshipPlan {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Number)
  price: number;

  @Field(() => String)
  stripePlanId: string;

  @Field(() => String)
  stripeProductId: string;

  @Field(() => String)
  channelId: string;

  @Field(() => UserModel)
  channel: UserModel;
  
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
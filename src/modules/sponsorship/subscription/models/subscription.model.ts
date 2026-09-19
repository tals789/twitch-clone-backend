import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SponsorshipSubscription } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";
import { PlanModel } from "../../plan/models/plan.model";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => String)
  channelId: string;

  @Field(() => UserModel)
  channel: UserModel;

  @Field(() => String)
  planId: string;

  @Field(() => PlanModel)
  plan: PlanModel;

  @Field(() => Date)
  expiresAt: Date;
  
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Transaction, TransactionStatus } from "@prisma/prisma/client";
import { UserModel } from "@root/modules/auth/account/models/user.model";

registerEnumType(TransactionStatus, { name: 'TransactionStatus' })

@ObjectType()
export class TransactionModel implements Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  amount: number;
 
  @Field(() => String)
  currency: string;
 
  @Field(() => String)
  stripeSubscriptionId: string;

  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Field(() => String)
  userId: string;

  @Field(() => UserModel)
  user: UserModel;
  
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
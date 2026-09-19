import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionModel } from './models/transaction.model';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { MakePaymentModel } from './models/make-payment.model';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => [TransactionModel], { name: 'getMyTransactions' })
  @Auth()
  async getMyTransactions(@Authorized() user: User) {
    return await this.transactionService.getMyTransactions(user)
  }

  @Mutation(() => MakePaymentModel, { name: 'makePayment' })
  @Auth()
  async makePayment(@Authorized() user: User, @Args('planId') planId: string) {
    return await this.transactionService.makePayment(user, planId)
  }
}
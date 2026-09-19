import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import { ChangeEmailInput } from './inputs/change-email.input';
import type { User } from '@prisma/prisma/client';
import { ChangePasswordInput } from './inputs/change-password.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => UserModel, { name: 'getMyProfile' })
  @Auth()
  async getMyProfile(@Authorized('id') id: string) {
    return await this.accountService.me(id)
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  async create(@Args('data') input: CreateUserInput) {
    return await this.accountService.create(input)
  }

  @Mutation(() => Boolean, { name: 'changeEmail' })
  @Auth()
  async changeEmail(@Args('data') input: ChangeEmailInput, @Authorized() user: User) {
    return await this.accountService.changeEmail(user, input)
  }

  @Mutation(() => Boolean, { name: 'changePassword' })
  @Auth()
  async changePassword(@Args('data') input: ChangePasswordInput, @Authorized() user: User) {
    return await this.accountService.changePassword(user, input)
  }
}
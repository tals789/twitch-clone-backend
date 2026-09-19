import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PasswordRecoveryService } from './password-recovery.service';
import type { GqlContext } from '@root/shared/types/gql-context.type';
import { UserAgent } from '@root/shared/decorators/user-agent.decorator';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { NewPasswordInput } from './inputs/new-password.input';

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
  constructor(private readonly passwordRecoveryService: PasswordRecoveryService) { }

  @Mutation(() => Boolean, { name: 'resetPassword' })
  async resetPassword(
    @Context() { req }: GqlContext,
    @Args('data') input: ResetPasswordInput,
    @UserAgent() userAgent: string
  ) {
    return this.passwordRecoveryService.resetPassword(req, input, userAgent)
  }

  @Mutation(() => Boolean, { name: 'setNewPassword' })
  async newPassword(
    @Args('data') input: NewPasswordInput,
  ) {
    return this.passwordRecoveryService.newPassword(input)
  }
}
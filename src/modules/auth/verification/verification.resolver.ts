import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import type { GqlContext } from '@root/shared/types/gql-context.type';
import { VerificationInput } from './inputs/verification.input';
import { UserAgent } from '@root/shared/decorators/user-agent.decorator';
import { UserModel } from '../account/models/user.model';

@Resolver('Verification')
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) { }

  @Mutation(() => UserModel, { name: 'verifyAccount' })
  async verify(
    @Context() { req }: GqlContext,
    @Args('data') input: VerificationInput,
    @UserAgent() userAgent: string
  ) {
    return this.verificationService.verify(req, input, userAgent)
  }
}

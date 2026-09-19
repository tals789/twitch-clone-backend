import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { DeactivateService } from './deactivate.service';
import type { GqlContext } from '@root/shared/types/gql-context.type';
import type { User } from '@prisma/prisma/client';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { UserAgent } from '@root/shared/decorators/user-agent.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import { AuthModel } from '../account/models/auth.model';
import { Auth } from '@root/shared/decorators/auth.decorator';

@Resolver('Deactivate')
export class DeactivateResolver {
  constructor(private readonly deactivateService: DeactivateService) { }

  @Mutation(() => AuthModel, { name: 'deactivateAccount' })
  @Auth()
  async deactivate(
    @Context() { req }: GqlContext,
    @Args('data') input: DeactivateAccountInput,
    @Authorized() user: User,
    @UserAgent() userAgent: string,
  ) {
    return this.deactivateService.deactivate(req, input, user, userAgent)
  }
}
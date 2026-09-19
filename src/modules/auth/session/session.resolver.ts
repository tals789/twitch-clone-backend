import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import type { GqlContext } from '@root/shared/types/gql-context.type';
import { LoginInput } from './inputs/login.input';
import { UserAgent } from '@root/shared/decorators/user-agent.decorator';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { SessionModel } from './models/session.model';
import { AuthModel } from '../account/models/auth.model';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => AuthModel, { name: 'login' })
  async login(@Args('data') input: LoginInput, @Context() { req }: GqlContext, @UserAgent() userAgent: string) {
    return await this.sessionService.login(req, input, userAgent)
  }

  @Mutation(() => Boolean, { name: 'logout' })
  @Auth()
  async logout(@Context() { req }: GqlContext) {
    return await this.sessionService.logout(req)
  }

  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  @Auth()
  async findByUser(@Context() { req }: GqlContext) {
    return await this.sessionService.findByUser(req)
  }

  @Query(() => SessionModel, { name: 'findCurrentSession' })
  @Auth()
  async findCurrentSession(@Context() { req }: GqlContext) {
    return await this.sessionService.findCurrent(req)
  }

  @Mutation(() => Boolean, { name: 'clearSession' })
  async clearSession(@Context() { req }: GqlContext) {
    return await this.sessionService.clearSession(req)
  }

  @Mutation(() => Boolean, { name: 'deleteSession' })
  @Auth()
  async deleteSession(@Context() { req }: GqlContext, @Args('id') id: string) {
    return await this.sessionService.deleteSession(req, id)
  }
}
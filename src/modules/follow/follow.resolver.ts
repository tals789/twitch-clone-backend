import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowModel } from './models/follow.model';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';

@Resolver('Follow')
export class FollowResolver {
  constructor(private readonly followService: FollowService) { }

  @Query(() => [FollowModel], { name: 'getMyFollowers' })
  @Auth()
  async getMyFollowers(@Authorized() user: User) {
    return this.followService.getMyFollowers(user)
  }

  @Query(() => [FollowModel], { name: 'getMyFollowings' })
  @Auth()
  async getMyFollowings(@Authorized() user: User) {
    return this.followService.getMyFollowings(user)
  }

  @Mutation(() => Boolean, { name: 'followChannel' })
  @Auth()
  async follow(@Authorized() user: User, @Args('channelId') channelId: string) {
    return this.followService.follow(user, channelId)
  }

  @Mutation(() => Boolean, { name: 'unfollowChannel' })
  @Auth()
  async unfollow(@Authorized() user: User, @Args('channelId') channelId: string) {
    return this.followService.unfollow(user, channelId)
  }
}
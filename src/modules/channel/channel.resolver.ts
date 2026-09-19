import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { UserModel } from '../auth/account/models/user.model';
import { SubscriptionModel } from '../sponsorship/subscription/models/subscription.model';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) { }

  @Query(() => [UserModel], { name: 'getRecommendedChannels' })
  async getRecommendedChannels() {
    return await this.channelService.getRecommendedChannels()
  }

  @Query(() => UserModel, { name: 'getChannelByUsername' })
  async getByUsername(@Args('username') username: string) {
    return await this.channelService.getByUsername(username)
  }

  @Query(() => Number, { name: 'getFollowersCountByChannel' })
  async getFollowersCountByChannel(@Args('channelId') channelId: string) {
    return await this.channelService.getFollowersCountByChannel(channelId)
  }

  @Query(() => [SubscriptionModel], { name: 'getSponsorsByChannel' })
  async getSponsorsByChannel(@Args('channelId') channelId: string) {
    return await this.channelService.getSponsorsByChannel(channelId)
  }
}
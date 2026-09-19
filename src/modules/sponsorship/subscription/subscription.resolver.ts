import { Query, Resolver } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { SubscriptionModel } from './models/subscription.model';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';

@Resolver('Subscription')
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Query(() => [SubscriptionModel], { name: 'getMySponsors' })
  @Auth()
  async getMySponsors(@Authorized() user: User) {
    return this.subscriptionService.getMySponsors(user)
  }
}
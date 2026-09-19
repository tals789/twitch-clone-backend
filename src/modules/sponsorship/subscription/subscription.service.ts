import { Injectable } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) { }

  async getMySponsors(user: User) {
    return await this.prisma.sponsorshipSubscription.findMany({
      where: { channelId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { plan: true, user: true, channel: true }
    })
  }
}
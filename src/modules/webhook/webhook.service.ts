import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { LivekitService } from '../libs/livekit/livekit.service';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import Stripe from 'stripe';
import { TransactionStatus } from '@prisma/prisma/enums';
import { StripeService } from '../libs/stripe/stripe.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly livekit: LivekitService,
    private readonly notification: NotificationService,
    private readonly telegram: TelegramService,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) { }

  async receiveWebhookLivekit(body: string, auth: string) {
    const event = this.livekit.receiver.receive(body, auth, true)

    if (event.event === 'ingress_started') {
      console.log('STREAM STARTED: ', event.ingressInfo?.url)
      
      const stream = await this.prisma.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: true },
        include: { user: true } 
      })

      const followers = await this.prisma.follow.findMany({
        where: { followingId: stream.user.id, follower: { isDeactivated: false } },
        include: { follower: { include: { notificationSettings: true } } } 
      })

      for (const follow of followers) {
        if (follow.follower.notificationSettings?.siteNotifications) {
          await this.notification.createStreamStart(follow.follower.id, stream.user)
        }

        if (follow.follower.notificationSettings?.telegramNotifications && follow.follower.telegramId) {
          await this.telegram.sendStreamStart(follow.follower.telegramId, stream.user)
        }
      }
    }

    if (event.event === 'ingress_ended') {
      const stream = await this.prisma.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: false }
      })

      await this.prisma.chatMessage.deleteMany({
        where: { streamId: stream.id }
      })
    }
  }

  async receiveWebhookStripe(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      const planId = session.metadata!.planId
      const userId = session.metadata!.userId
      const channelId = session.metadata!.channelId

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDay() + 30)

      const sponsorshipSubscription = await this.prisma.sponsorshipSubscription.create({
        data: { expiresAt, channelId, userId, planId },
        include: { plan: true, user: true, channel: { include: { notificationSettings: true } } }
      })

      await this.prisma.transaction.updateMany({
        where: { stripeSubscriptionId: session.id, status: TransactionStatus.PENDING },
        data: { status: TransactionStatus.SUCCESS }
      })

      if (sponsorshipSubscription.channel.notificationSettings?.siteNotifications) {
        await this.notification.createNewSponsorship(sponsorshipSubscription.channel.id, sponsorshipSubscription.plan, sponsorshipSubscription.user)
      }

      if (sponsorshipSubscription.channel.notificationSettings?.telegramNotifications && sponsorshipSubscription.channel.telegramId) {
        await this.telegram.sendNewSponsorship(sponsorshipSubscription.channel.telegramId, sponsorshipSubscription.plan, sponsorshipSubscription.user)
      }
    }

    if (event.type === 'checkout.session.expired') {
      await this.prisma.transaction.updateMany({
        where: { stripeSubscriptionId: session.id },
        data: { status: TransactionStatus.EXPIRED }
      })
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      await this.prisma.transaction.updateMany({
        where: { stripeSubscriptionId: session.id },
        data: { status: TransactionStatus.FAILED }
      })
    }
  }

  async constructStripeEvent(payload: any, signature: any): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(payload, signature, this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'))
  }
}
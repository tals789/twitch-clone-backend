import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { StripeService } from '@root/modules/libs/stripe/stripe.service';
import { pl } from 'zod/v4/locales';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly stripe: StripeService,
  ) { }

  async getMyTransactions(user: User) {
    return await this.prisma.transaction.findMany({
      where: { userId: user.id }
    })
  }

  async makePayment(user: User, planId: string) {
    const plan = await this.prisma.sponsorshipPlan.findUnique({
      where: { id: planId },
      include: { channel: true }
    })

    if (!plan) throw new NotFoundException('План не найден')

    if (user.id === plan.channel.id) throw new ConflictException('Вы не можете оформить спонсортство сами на себя')

    const subscriptionExists = await this.prisma.sponsorshipSubscription.findFirst({
      where: { userId: user.id, channelId: plan.channel.id }
    })

    if (subscriptionExists) throw new ConflictException('Вы уже оформили спонсорство на этот канал')

    const customer = await this.stripe.customers.create({
      name: user.username,
      email: user.email
    })

    const successUrl = `${this.config.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.title)}&username=${encodeURIComponent(plan.channel.username)}`

    const cancelUrl = this.config.getOrThrow('ALLOWED_ORIGIN')

    const checkoutSession = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'rub',
            product_data: {
              name: plan.title,
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: { interval: 'month' }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customer.id,
      metadata: {
        planId: plan.id,
        userId: user.id,
        channelId: plan.channel.id,
      }
    })

    await this.prisma.transaction.create({
      data: {
        amount: plan.price,
        currency: checkoutSession.currency!,
        stripeSubscriptionId: checkoutSession.id,
        user: { connect: { id: user.id } }
      }
    })

    return { url: checkoutSession.url }
  }
}
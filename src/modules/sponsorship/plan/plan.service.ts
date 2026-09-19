import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { StripeService } from '@root/modules/libs/stripe/stripe.service';
import { TCreatePlanInput } from './inputs/create-plan.input';

@Injectable()
export class PlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
  ) { }

  async getMyPlans(user: User) {
    return await this.prisma.sponsorshipPlan.findMany({
      where: { channelId: user.id }
    })
  }

  async create(user: User, input: TCreatePlanInput) {
    const { price, title, description } = input

    const channel = await this.prisma.user.findUnique({
      where: { id: user.id } 
    })

    if (!channel?.isVerified) throw new ForbiddenException('Создание планов доступно только верифицированным каналам')

    const stripePlan = await this.stripe.plans.create({
      amount: Math.round(price * 100),
      currency: 'rub',
      interval: 'month',
      product: {
        name: title
      }
    })

    await this.prisma.sponsorshipPlan.create({
      data: {
        title,
        description,
        price,
        stripeProductId: stripePlan.product!.toString(),
        stripePlanId: stripePlan.id,
        channel: { connect: { id: user.id } }
      }
    })

    return true
  }

  async delete(planId: string) {
    const plan = await this.prisma.sponsorshipPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) throw new NotFoundException('План не найден')

    await this.stripe.plans.del(plan.stripePlanId)
    await this.stripe.products.del(plan.stripeProductId)
    
    await this.prisma.sponsorshipPlan.delete({
      where: { id: plan.id }
    })

    return true
  }
}
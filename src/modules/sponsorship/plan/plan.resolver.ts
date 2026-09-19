import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanService } from './plan.service';
import { PlanModel } from './models/plan.model';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { CreatePlanInput } from './inputs/create-plan.input';

@Resolver('Plan')
export class PlanResolver {
  constructor(private readonly planService: PlanService) { }

  @Query(() => [PlanModel], { name: 'getMyPlans' })
  @Auth()
  async getMyPlans(@Authorized() user: User) {
    return await this.planService.getMyPlans(user)
  }

  @Mutation(() => Boolean, { name: 'createPlan' })
  @Auth()
  async create(@Authorized() user: User, @Args('data') input: CreatePlanInput) {
    return await this.planService.create(user, input)
  }

  @Mutation(() => Boolean, { name: 'deletePlan' })
  @Auth()
  async delete(@Args('planId') planId: string) {
    return await this.planService.delete(planId)
  }
}
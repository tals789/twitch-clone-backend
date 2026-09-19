import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IngressService } from './ingress.service';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { IngressInput } from 'livekit-server-sdk';

@Resolver('Ingress')
export class IngressResolver {
  constructor(private readonly ingressService: IngressService) { }

  @Mutation(() => Boolean, { name: 'createIngress' })
  @Auth()
  async create(@Authorized() user: User, @Args('ingressType') ingressType: IngressInput) {
    return await this.ingressService.create(user, ingressType)
  }
}
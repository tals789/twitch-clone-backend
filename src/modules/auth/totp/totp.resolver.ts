import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TotpService } from './totp.service';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { TOTPModel } from './models/totp.model';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { EnableTOTPInput } from './inputs/enable-totp.input';

@Resolver('Totp')
export class TotpResolver {
  constructor(private readonly totpService: TotpService) { }

  @Query(() => TOTPModel, { name: 'generateTOTPSecret' })
  @Auth()
  async generate(@Authorized() user: User) {
    return this.totpService.generate(user)
  }

  @Mutation(() => Boolean, { name: 'enableTOTP' })
  @Auth()
  async enable(@Authorized() user: User, @Args('data') input: EnableTOTPInput) {
    return this.totpService.enable(user, input)
  }

  @Mutation(() => Boolean, { name: 'disableTOTP' })
  @Auth()
  async disable(@Authorized() user: User) {
    return this.totpService.disable(user)
  }
}
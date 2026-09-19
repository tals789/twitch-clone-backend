import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaModule } from '@root/core/prisma/prisma.module';
import { VerificationService } from '../verification/verification.service';

@Module({
  imports: [PrismaModule],
  providers: [AccountResolver, AccountService, VerificationService],
})
export class AccountModule {}

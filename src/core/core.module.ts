import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from '@root/shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { getGraphQLConfig } from './config/graphql.config';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from '@root/modules/auth/account/account.module';
import { SessionModule } from '@root/modules/auth/session/session.module';
import { RedisModule } from '@root/redis/redis.module';
import { VerificationModule } from '@root/modules/auth/verification/verification.module';
import { MailModule } from '@root/modules/libs/mail/mail.module';
import { PasswordRecoveryModule } from '@root/modules/auth/password-recovery/password-recovery.module';
import { TotpModule } from '@root/modules/auth/totp/totp.module';
import { DeactivateModule } from '@root/modules/auth/deactivate/deactivate.module';
import { CronModule } from '@root/modules/cron/cron.module';
import { StorageModule } from '@root/modules/libs/storage/storage.module';
import { ProfileModule } from '@root/modules/auth/profile/profile.module';
import { StreamModule } from '@root/modules/stream/stream.module';
import { LivekitModule } from '@root/modules/libs/livekit/livekit.module';
import { getLiveKitConfig } from './config/livekit.config';
import { IngressModule } from '@root/modules/stream/ingress/ingress.module';
import { WebhookModule } from '@root/modules/webhook/webhook.module';
import { CategoryModule } from '@root/modules/category/category.module';
import { ChatModule } from '@root/modules/chat/chat.module';
import { FollowModule } from '@root/modules/follow/follow.module';
import { ChannelModule } from '@root/modules/channel/channel.module';
import { NotificationModule } from '@root/modules/notification/notification.module';
import { TelegramModule } from '@root/modules/libs/telegram/telegram.module';
import { StripeModule } from '../modules/libs/stripe/stripe.module';
import { getStripeConfig } from './config/stripe.config';
import { PlanModule } from '@root/modules/sponsorship/plan/plan.module';
import { TransactionModule } from '@root/modules/sponsorship/transaction/transaction.module';
import { SubscriptionModule } from '@root/modules/sponsorship/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: getGraphQLConfig,
      inject: [ConfigService]
    }),
    LivekitModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getLiveKitConfig,
      inject: [ConfigService]
    }),
    StripeModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getStripeConfig,
      inject: [ConfigService]
    }),
    PrismaModule,
    AccountModule,
    SessionModule,
    RedisModule,
    VerificationModule,
    MailModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivateModule,
    CronModule,
    StorageModule,
    ProfileModule,
    StreamModule,
    IngressModule,
    WebhookModule,
    CategoryModule,
    ChatModule,
    FollowModule,
    ChannelModule,
    NotificationModule,
    TelegramModule,
    PlanModule,
    TransactionModule,
    SubscriptionModule
  ],
})
export class CoreModule {}
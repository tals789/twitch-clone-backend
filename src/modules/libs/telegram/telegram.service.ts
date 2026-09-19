import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/prisma/enums';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { MESSAGES } from './telegram.messages';
import { BUTTONS } from './telegram.buttons';
import { ISessionMetadata } from '@root/shared/types/session-metadata.type';
import { SponsorshipPlan, User } from '@prisma/prisma/client';

@Update()
@Injectable()
export class TelegramService extends Telegraf {
  private readonly _token: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super(config.getOrThrow<string>('TG_BOT_TOKEN'))
    this._token = config.getOrThrow<string>('TG_BOT_TOKEN')
  }

  @Start()
  async onStart(@Ctx() ctx: any) {
    const chatId = ctx.chat?.id.toString()
    const token = ctx.message.text.split(' ')[1]

    if (token) {
      const authToken = await this.prisma.token.findUnique({
        where: { token, type: TokenType.TELEGRAM_AUTH }
      })

      if(!authToken) await ctx.reply(MESSAGES.invalidToken)

      const isExpired = new Date(authToken!.expiresIn) < new Date()

      if (isExpired) {
        await ctx.reply(MESSAGES.invalidToken)
      }

      await this.connectTelegram(authToken!.userId, chatId)

      await this.prisma.token.delete({
        where: { id: authToken!.id }
      })

      await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess)
    } else {
      const user = await this.getUserByChatId(chatId)
  
      if (user) {
        return await this.onMe(ctx)
      } else {
        await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
      }
    }
  }

  @Command('me')
  @Action('me')
  async onMe(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id.toString()

    const user = await this.getUserByChatId(chatId!)
    
    if (!user) {
      await ctx.reply('Пользователь не найден')
    } else {
      const followersCount = await this.prisma.follow.count({
        where: { followingId: user?.id }
      })
  
      await ctx.replyWithHTML(MESSAGES.profile(user!, followersCount), BUTTONS.profile)
    }
  }

  @Command('followings')
  @Action('followings')
  async onFollowings(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id.toString()

    const user = await this.getUserByChatId(chatId!)

    if (!user) {
      await ctx.reply('')
    } else {
      const follows = await this.prisma.follow.findMany({
        where: { followerId: user.id },
        include: { following: true }
      })

      if (user && follows.length) {
        const followsList = follows.map(follow => MESSAGES.follows(follow.following)).join('\n')
        const message = `<b>🌟 Каналы на которые вы подписаны:</b>\n\n${followsList}`
        await ctx.replyWithHTML(message)
      } else {
        await ctx.replyWithHTML('<b>❌ У вас нет подписок.</b>')
      }
    }
    
    
  }

  async sendPasswordResetToken(chatId: string, token: string, metadata: ISessionMetadata) {
    await this.telegram.sendMessage(chatId, MESSAGES.resetPassword(token, metadata), { parse_mode: 'HTML' })
  }

  async sendDeactivateAccountToken(chatId: string, token: string) {
    await this.telegram.sendMessage(chatId, MESSAGES.deactivate(token), { parse_mode: 'HTML' })
  }

  async sendAccountDeletion(chatId: string) {
    await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted, { parse_mode: 'HTML' })
  }

  async sendStreamStart(chatId: string, channel: User) {
    await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), { parse_mode: 'HTML' })
  }

  async sendNewFollower(chatId: string, follower: User) {
    const user = await this.getUserByChatId(chatId)
    
    await this.telegram.sendMessage(chatId, MESSAGES.newFollowing(follower, user!.followings.length), { parse_mode: 'HTML' })
  }

  async sendNewSponsorship(chatId: string, plan: SponsorshipPlan, sponsor: User) {
    await this.telegram.sendMessage(chatId, MESSAGES.newSponsorship(plan, sponsor), { parse_mode: 'HTML' })
  }

  async sendEnableTwoFactor(chatId: string) {
    await this.telegram.sendMessage(chatId, MESSAGES.enableTwoFactor, { parse_mode: 'HTML' })
  }

  async sendVerifyChannel(chatId: string) {
    await this.telegram.sendMessage(chatId, MESSAGES.vefifyChannel, { parse_mode: 'HTML' })
  }

  private async connectTelegram(userId: string, chatId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { telegramId: chatId }
    })
  }

  private async getUserByChatId(chatId: string) {
    return await this.prisma.user.findUnique({
      where: { telegramId: chatId },
      include: { followers: true, followings: true }
    })
  }
}
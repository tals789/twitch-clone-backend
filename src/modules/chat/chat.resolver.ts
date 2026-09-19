import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { ChatService } from './chat.service'
import { PubSub } from 'graphql-subscriptions'
import { ChatMessageModel } from './models/chat-message.model'
import { ChangeChatSettingsInput } from './inputs/change-chat-setting.input'
import { Authorized } from '@root/shared/decorators/authorized.decorator'
import type { User } from '@prisma/prisma/client'
import { Auth } from '@root/shared/decorators/auth.decorator'
import { SendMessageInput } from './inputs/send-message.input'

@Resolver('Chat')
export class ChatResolver {
  private readonly pubsub: PubSub

  constructor(private readonly chatService: ChatService) {
    this.pubsub = new PubSub()
  }

  @Subscription(() => ChatMessageModel, {
    name: 'chatMessageAdded',
    filter: (payload, variables) =>
      payload.chatMessageAdded.streamId === variables.streamId,
  })
  async chatMessageAdded(@Args('streamId') streamId: string) {
    return this.pubsub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
  }

  @Query(() => [ChatMessageModel], { name: 'getChatMessagesByStream' })
  async getMessagesByStream(@Args('streamId') streamId: string) {
    return this.chatService.getMessagesByStream(streamId)
  }

  @Mutation(() => Boolean, { name: 'changeChatSettings' })
  @Auth()
  async changeSettings(
    @Args('data') input: ChangeChatSettingsInput,
    @Authorized() user: User,
  ) {
    return this.chatService.changeSettings(user, input)
  }

  @Mutation(() => ChatMessageModel, { name: 'sendMessage' })
  @Auth()
  async sendMessage(
    @Args('data') input: SendMessageInput,
    @Authorized('id') userId: string,
  ) {
    const message = await this.chatService.sendMessage(userId, input)

    this.pubsub.publish('CHAT_MESSAGE_ADDED', { chatMessageAdded: message })

    return message
  }
}

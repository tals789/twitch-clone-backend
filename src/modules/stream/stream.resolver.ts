import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { StreamModel } from './models/stream.model';
import { FiltersInput } from './inputs/filters.input';
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { Auth } from '@root/shared/decorators/auth.decorator';
import Upload from 'graphql-upload/Upload.js'
import graphqlUpload from 'graphql-upload/GraphQLUpload.js'
import { FileValidationPipe } from '@root/shared/pipes/file-validation.pipe';
import { GenerateStreamTokenModel } from './models/generate-token.model';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Resolver('Stream')
export class StreamResolver {
  constructor(private readonly streamService: StreamService) { }

  @Query(() => [StreamModel], { name: 'getAllStreams' })
  async getAll(@Args('filter') input: FiltersInput) {
    return this.streamService.getAll(input)
  }

  @Query(() => [StreamModel], { name: 'getRandomStreams' })
  async getRandomStreams() {
    return this.streamService.getRandomStreams()
  }

  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  @Auth()
  async changeInfo(@Authorized() user: User, @Args('data') input: ChangeStreamInfoInput) {
    return this.streamService.changeInfo(user, input)
  }

  @Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
  @Auth()
  async changeStreamThumbnail(@Authorized() user: User, @Args('thumbnail', { type: () => graphqlUpload }, FileValidationPipe) thumbnail: Upload) {
    return this.streamService.changeThumbnail(user, thumbnail)
  }

  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  @Auth()
  async removeStreamThumbnail(@Authorized() user: User) {
    return this.streamService.removeThumbnail(user)
  }

  @Mutation(() => GenerateStreamTokenModel, { name: 'generateStremaToken' })
  async generateStreamToken(@Args('data') input: GenerateStreamTokenInput) {
    return await this.streamService.generateStreamToken(input)
  }
}
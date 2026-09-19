import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import graphqlUpload from 'graphql-upload/GraphQLUpload.js'
import Upload from 'graphql-upload/Upload.js'
import { Authorized } from '@root/shared/decorators/authorized.decorator';
import type { User } from '@prisma/prisma/client';
import { Auth } from '@root/shared/decorators/auth.decorator';
import { FileValidationPipe } from '@root/shared/pipes/file-validation.pipe';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinkInput, SocialLinkOrderInput } from './inputs/social-link.input';
import { SocialLinkModel } from './models/social-link.model';

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) { }

  @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
  @Auth()
  async changeAvatar(@Authorized() user: User, @Args('avatar', { type: () => graphqlUpload }, FileValidationPipe) avatar: Upload) {
    return this.profileService.changeAvatar(user, avatar)
  }

  @Mutation(() => Boolean, { name: 'removeProfileAvatar' })
  @Auth()
  async removeAvatar(@Authorized() user: User) {
    return this.profileService.removeAvatar(user)
  }

  @Mutation(() => Boolean, { name: 'changeProfileInfo' })
  @Auth()
  async changeInfo(@Authorized() user: User, @Args('data') input: ChangeProfileInfoInput) {
    return this.profileService.changeInfo(user, input)
  }

  @Mutation(() => Boolean, { name: 'createSocialLink' })
  @Auth()
  async createSocialLink(@Authorized() user: User, @Args('data') input: SocialLinkInput) {
    return this.profileService.createSocialLink(user, input)
  }

  @Mutation(() => Boolean, { name: 'reorderSocialLinks' })
  @Auth()
  async reorderSocialLinks(@Args('list', { type: () => [SocialLinkOrderInput] }) list: SocialLinkOrderInput[]) {
    return this.profileService.reorderSocialLinks(list)
  }

  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  @Auth()
  async updateSocialLink(@Args('id') id: string, @Args('data') input: SocialLinkInput) {
    return this.profileService.updateSocialLink(id, input)
  }

  @Mutation(() => Boolean, { name: 'deleteSocialLink' })
  @Auth()
  async deleteSocialLink(@Args('id') id: string) {
    return this.profileService.deleteSocialLink(id)
  }

  @Query(() => [SocialLinkModel], { name: 'getSocialLinks' })
  @Auth()
  async getSocialLinks(@Authorized() user: User) {
    return this.profileService.getSocialLinks(user)
  }
}
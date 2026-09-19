import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { StorageService } from '@root/modules/libs/storage/storage.service';
import Upload from 'graphql-upload/Upload.js'
import sharp from 'sharp'
import { TChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { TSocialLinkInput, TSocialLinkOrderInput } from './inputs/social-link.input';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) { }

  async changeAvatar(user: User, file: Upload) {
    if (user.avatar) {
      await this.storage.remove(user.avatar)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const fileName = `/channels/${user.username}.webp`

    if (file.filename && file.filename.endWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer()

      await this.storage.upload(processedBuffer, fileName, 'image/webp')
    } else {
      const processedBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer()

      await this.storage.upload(processedBuffer, fileName, 'image/webp')
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { avatar: fileName } })

    return true
  }

  async removeAvatar(user: User) {
    if (!user.avatar) {
      return
    }

    await this.storage.remove(user.avatar)
    
    await this.prisma.user.update({ where: { id: user.id }, data: { avatar: null } })

    return true
  }

  async changeInfo(user: User, input: TChangeProfileInfoInput) {
    const { displayName, username, bio } = input

    const usernameExists = await this.prisma.user.findUnique({
      where: { username }
    })

    if (usernameExists && username !== user.username) throw new ConflictException('Это имя пользователя уже занято')

    await this.prisma.user.update({ where: { id: user.id }, data: { username, bio, displayName } })

    return true
  }

  async createSocialLink(user: User, input: TSocialLinkInput) {
    const { title, url } = input

    const lastSocialLink = await this.prisma.socialLink.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' }
    })

    const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

    await this.prisma.socialLink.create({
      data: { title, url, position: newPosition, user: { connect: { id: user.id } } }
    })

    return true
  }

  async reorderSocialLinks(list: TSocialLinkOrderInput[]) {
    if (!list.length) return

    const updatePromises = list.map(socialLink => this.prisma.socialLink.update({
      where: { id: socialLink.id },
      data: { position: socialLink.position }
    }))

    await Promise.all(updatePromises)

    return true
  }

  async updateSocialLink(id: string, input: TSocialLinkInput) {
    const { title, url } = input

    await this.prisma.socialLink.update({
      where: { id },
      data: { title, url }
    })

    return true
  }

  async deleteSocialLink(id: string) {
    await this.prisma.socialLink.delete({
      where: { id },
    })

    return true
  }

  async getSocialLinks(user: User) {
    return await this.prisma.socialLink.findMany({ where: { userId: user.id }, orderBy: { position: 'asc' } })
  }
}
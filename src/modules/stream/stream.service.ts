import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { TFiltersInput } from './inputs/filters.input';
import { Prisma, User } from '@prisma/prisma/client';
import { TChangeStreamInfoInput } from './inputs/change-stream-info.input';
import Upload from 'graphql-upload/Upload.js'
import sharp from 'sharp'
import { StorageService } from '../libs/storage/storage.service';
import { TGenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class StreamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) { }

  async getAll(input: TFiltersInput = {}) {
    const { searchTerm, skip, take } = input

    const whereClause = searchTerm ? this.getBySearchTermFilter(searchTerm) : undefined
    
    return await this.prisma.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: { user: { isDeactivated: false }, ...whereClause },
      include: { user: true, category: true  }
    })
  }

  async changeInfo(user: User, input: TChangeStreamInfoInput) {
    const { title, categoryId } = input

    await this.prisma.stream.update({ where: { userId: user.id }, data: { title, category: { connect: { id: categoryId } } } })

    return true
  }

  async changeThumbnail(user: User, file: Upload) {
    const stream = await this.getByUserId(user)
    
    if (stream?.thumbnailUrl) {
      await this.storage.remove(stream?.thumbnailUrl)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const fileName = `/streams/${user.username}.webp`

    if (file.filename && file.filename.endWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer()

      await this.storage.upload(processedBuffer, fileName, 'image/webp')
    } else {
      const processedBuffer = await sharp(buffer).resize(1280, 720).webp().toBuffer()

      await this.storage.upload(processedBuffer, fileName, 'image/webp')
    }

    await this.prisma.stream.update({ where: { userId: user.id }, data: { thumbnailUrl: fileName } })

    return true
  }

  async removeThumbnail(user: User) {
    const stream = await this.getByUserId(user)
    
    if (!stream?.thumbnailUrl) {
      return
    }

    await this.storage.remove(stream.thumbnailUrl)
    
    await this.prisma.stream.update({ where: { userId: user.id }, data: { thumbnailUrl: null } })

    return true
  }
  
  async getRandomStreams() {
    const total = await this.prisma.stream.count({
      where: { user: { isDeactivated: false } },
    })

    const randomIndexes = new Set<number>()

    while (randomIndexes.size < 4) {
      const randomIndex = Math.floor(Math.random() * total)

      randomIndexes.add(randomIndex)
    }

    const streams = await this.prisma.stream.findMany({
      where: { user: { isDeactivated: false } },
      include: { user: true },
      skip: 0,
      take: total
    })

    return Array.from(randomIndexes).map(index => streams[index])
  }

  async generateStreamToken(input: TGenerateStreamTokenInput) {
    const { channelId, userId } = input

    let self: { id: string, username: string }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      self = { id: user.id, username: user.username }
    } else {
      self = { id: userId, username: `Зритель ${randomUUID()}` }
    }

    const channel = await this.prisma.user.findUnique({
      where: { id: channelId }
    })

    if (!channel) {
      throw new NotFoundException('Канал не найден')
    }

    const isHost = self.id === channel.id

    const token = new AccessToken(
      this.config.getOrThrow('LIVEKIT_API_KEY'),
      this.config.getOrThrow('LIVEKIT_API_SECRET'),
      {
        identity: isHost ? `Host-${self.id}` : self.id.toString(),
        name: self.username
      }
    )

    token.addGrant({
      room: channel.id,
      roomJoin: true,
      canPublish: false
    })

    return { token: token.toJwt() }
  }

  private async getByUserId(user: User) {
    return await this.prisma.stream.findUnique({ where: { userId: user.id } })
  }

  private getBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        }
      ]
    }
  }
}
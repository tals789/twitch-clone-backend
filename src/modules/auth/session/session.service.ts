import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@root/core/prisma/prisma.service'
import { TLoginInput } from './inputs/login.input'
import { verify } from 'argon2'
import type { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { getSessionMetadata } from '@root/shared/utils/session-metadata.util'
import { RedisService } from '@root/redis/redis.service'
import { destroySession, saveSession } from '@root/shared/utils/session.util'
import { VerificationService } from '../verification/verification.service'
import { TOTP } from 'otpauth'

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly verification: VerificationService
  ) {}

  async findByUser(req: Request) {
    const userId = req.session.userId

    if(!userId) {
      throw new NotFoundException('Пользователь не обнаружен в сессии')
    }

    const keys = await this.redis.keys('*')

    const userSessions: any = []

    for (const key of keys) {
      const sessionData = await this.redis.get(key)

      if(sessionData) {
        const session = JSON.parse(sessionData)

        if(session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1]
          })
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt)

    return userSessions.filter(session => session.id !== req.session.id)
  }

  async findCurrent(req: Request) {
    const sessionId = req.session.id
    
    const sessionData = await this.redis.get(`${this.config.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`)
    
    const session = JSON.parse(sessionData!)
    
    return {
      ...session,
      id: sessionId
    }
  }

  async clearSession(req: Request) {
    req.res?.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))

    return true
  }

  async deleteSession(req: Request, id: string) {
    if(req.session.id === id) {
      throw new ConflictException('Текущую сессию удалить нельзя')
    }

    await this.redis.del(`${this.config.getOrThrow<string>('SESSION_FOLDER')}${id}`)

    return true
  }

  async login(req: Request, input: TLoginInput, userAgent: string) {
    const { login, password, pin } = input
    

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: login } }, 
          { email: { equals: login } }
        ]
      },
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    const isPasswordCorrect = await verify(user.password, password)

    if(!isPasswordCorrect) {
      throw new UnauthorizedException('Неверный пароль')
    }

    

    if (!user.isEmailVerified) {
      await this.verification.sendVerificationToken(user)
      throw new BadRequestException('Аккаунт не верифирован. Пожалуйста, проверьте свою почту для подтверждения')
    }

    if (user.isTOTPEnabled) {
      if (!pin) {
        return {
          message: 'Необходим код для завершения авторизации'
        }
      }

      const totp = new TOTP({
        issuer: 'TwitchClone',
        label: `${user.email}`,
        algorithm: 'SHA1',
        digits: 6,
        secret: user.totpSecret || 'Нет TOTP секрета'
      })

      const delta = totp.validate({ token: pin })

      if (delta === null) {
        throw new BadRequestException('Неверный код')
      }
    }

    const metadata = getSessionMetadata(req, userAgent)

    return saveSession(req, user, metadata)
  }

  async logout(req: Request) {
    return destroySession(req, this.config)
  }
}

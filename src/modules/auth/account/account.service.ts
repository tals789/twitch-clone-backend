import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';
import { TCreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2'
import { VerificationService } from '../verification/verification.service';
import { User } from '@prisma/prisma/client';
import { TChangeEmailInput } from './inputs/change-email.input';
import { TChangePasswordInput } from './inputs/change-password.input';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService, private readonly verification: VerificationService) {}

  async me(id: string) {
    return await this.prisma.user.findUnique({ where: { id }, include: { socialLinks: true, notificationSettings: true } })
  }

  async create(input: TCreateUserInput) {
    const { email, password, username } = input

    const isUsernameExists = await this.prisma.user.findUnique({ where: { username } })

    if(isUsernameExists) {
      throw new ConflictException('Это имя пользователя уже занято')
    }

    const isEmailExists = await this.prisma.user.findUnique({ where: { email } })

    if(isEmailExists) {
      throw new ConflictException('Эта почта уже занята')
    }

    const user = await this.prisma.user.create({ data: { email, username, password: await hash(password), displayName: username, stream: { create: { title: `Стрим ${username}` } } } })

    // await this.verification.sendVerificationToken(user)

    return true
  }

  async changeEmail(user: User, input: TChangeEmailInput) {
    const { email } = input

    await this.prisma.user.update({ where: { id: user.id }, data: { email } })

    return true
  }

  async changePassword(user: User, input: TChangePasswordInput) {
    const { oldPassword, newPassword } = input

    const isPasswordCorrect = await verify(user.password, oldPassword)

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Неверный старый пароль')
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { password: await hash(newPassword) } })

    return true
  }
}
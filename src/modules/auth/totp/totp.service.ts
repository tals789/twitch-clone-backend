import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/prisma/client';
import { encode } from 'hi-base32'
import { randomBytes } from 'node:crypto';
import { TOTP } from 'otpauth'
import QRCode from 'qrcode';
import { TEnableTOTPInput } from './inputs/enable-totp.input';
import { PrismaService } from '@root/core/prisma/prisma.service';

@Injectable()
export class TotpService {
  constructor(private readonly prisma: PrismaService) {}
  
  async generate(user: User) {
    const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)

    const totp = new TOTP({
      issuer: 'TwitchClone',
      label: `${user.email}`,
      algorithm: 'SHA1',
      digits: 6,
      secret
    })

    const otpauthUrl = totp.toString()
    const qrcodeUrl = await QRCode.toDataURL(otpauthUrl)

    return { qrcodeUrl, secret }
  }

  async enable(user: User, input: TEnableTOTPInput) {
    const { pin, secret } = input

    const totp = new TOTP({
      issuer: 'TwitchClone',
      label: `${user.email}`,
      algorithm: 'SHA1',
      digits: 6,
      secret
    })

    const delta = totp.validate({ token: pin })

    if (delta === null) {
      throw new BadRequestException('Неверный код')
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { isTOTPEnabled: true, totpSecret: secret } })

    return true
  }

  async disable(user: User) {
    await this.prisma.user.update({ where: { id: user.id }, data: { isTOTPEnabled: false, totpSecret: null } })

    return true
  }
}
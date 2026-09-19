import { User } from "@prisma/prisma/client"
import { Request } from "express"
import { ISessionMetadata } from "../types/session-metadata.type"
import { InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export const saveSession = (req: Request, user: User, metadata: ISessionMetadata) => {
  return new Promise((resolve, reject) => {
    req.session.createdAt = new Date()
    req.session.userId = user.id
    req.session.metadata = metadata

    req.session.save(err => {
      if(err) {
        return reject(new InternalServerErrorException('Не удалось сохранить сессию'))
      }

      return resolve(user)
    })
  })
}
  
export const destroySession = (req: Request, config: ConfigService) => {
  return new Promise((resolve, reject) => {

    req.session.destroy(err => {
      if(err) {
        return reject(new InternalServerErrorException('Не удалось завершить сессию'))
      }

      req.res?.clearCookie(config.getOrThrow<string>('SESSION_NAME'))
      resolve(true)
    })
  })
}
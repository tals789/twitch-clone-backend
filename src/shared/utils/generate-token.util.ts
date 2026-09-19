import { TokenType, User } from "@prisma/prisma/client";
import { PrismaService } from "@root/core/prisma/prisma.service";
import { randomInt, randomUUID } from "node:crypto";

export const generateToken = async (prisma: PrismaService, user: User, type: TokenType, isUUID: boolean = true) => {
  let token: string

  if (isUUID) {
    token = randomUUID()
  } else {
    token = randomInt(100_000, 1_000_000).toString()
  }

  const expiresIn = new Date(new Date().getTime() + 300_000)

  const existingToken = await prisma.token.findFirst({
    where: { type, user: { id: user.id } }
  })

  if (existingToken) {
    await prisma.token.delete({ where: { id: existingToken.id } })
  }

  const newToken = await prisma.token.create({
    data: {
      token,
      expiresIn,
      type,
      user: {
        connect: {
          id: user.id
        }
      }
    },
    include: {
      user: { include: { notificationSettings: true } }
    }
  })

  return newToken
}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PrismaService } from "@root/core/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    if(typeof req.session.userId === 'undefined') {
      throw new UnauthorizedException('Пользователь не авторизован')
    }

    const user = await this.prisma.user.findUnique({ where: { id: req.session.userId } })

    req.user = user

    return true
  }
}
import 'tsconfig-paths/register'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ZodValidationPipe } from 'nestjs-zod'
import session from 'express-session'
import { ms, StringValue } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean.util'
import { RedisStore } from 'connect-redis'
import { RedisService } from './redis/redis.service'
import graphqlUpload from 'graphql-upload/graphqlUploadExpress.js'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, { rawBody: true })
  const config = app.get(ConfigService)
  const redis = app.get(RedisService).getClient()

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
  app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUpload())
  app.useGlobalPipes(new ZodValidationPipe())
  app.enableCors({ origin: config.getOrThrow<string>('ALLOWED_ORIGIN'), credentials: true, exposedHeaders: ['set-cookie'] })
  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'lax'
    },
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>('SESSION_FOLDER')
    })
  }))

  await app.listen(config.getOrThrow<number>('APP_PORT') ?? 3000)
}
bootstrap()

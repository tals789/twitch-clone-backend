import 'express-session'
import type { ISessionMetadata } from './session-metadata.type'

declare module 'express-session' {
  interface SessionData {
    userId?: string
    createdAt?: Date | string
    metadata: ISessionMetadata
  }
}
import User from '@/models/schemas/User.schema'
import { TokenPayload } from '@/types/token.type'

declare module 'express' {
  interface Request {
    user?: User
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedEmailVerifyToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
  }
}

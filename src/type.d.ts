/* eslint-disable @typescript-eslint/no-empty-object-type */
import 'axios'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '@/types/token.type'
import { UserDocument, UserDocumentWithoutPassword } from '@/models/user.model'

declare module 'express' {
  interface Request {
    user?: UserDocument | UserDocumentWithoutPassword | { _id: ObjectId }
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedEmailVerifyToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
  }
}

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

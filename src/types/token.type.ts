import { JwtPayload } from 'jsonwebtoken'

import { TokenType } from '@/constants/type'

export interface TokenPayload extends JwtPayload {
  userId: string
  tokenType: keyof typeof TokenType
  iat: number
  exp: number
}

export type SendEmailParams = {
  name: string
  email: string
  subject: string
  html: string
}

import { JwtPayload } from 'jsonwebtoken'

import { TokenType } from '@/constants/type'

export interface TokenPayload extends JwtPayload {
  userId: string
  tokenType: keyof typeof TokenType
  isVerified: boolean
  iat: number
  exp: number
}

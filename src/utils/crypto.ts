import { createHash } from 'node:crypto'

import envVariables from '@/schemas/env-variables.schema'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + envVariables.PASSWORD_SUFFIX_SECRET)
}

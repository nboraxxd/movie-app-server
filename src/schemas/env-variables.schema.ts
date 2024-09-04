import { z } from 'zod'
import { config } from 'dotenv'

config({
  path: '.env',
})

const envSchema = z.object({
  CLIENT_URL: z.string(),

  PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CLUSTER: z.string(),
  DB_NAME: z.string(),

  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: z.string(),
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: z.string(),
  JWT_SECRET_ACCESS_TOKEN: z.string(),
  JWT_SECRET_REFRESH_TOKEN: z.string(),
  JWT_SECRET_EMAIL_VERIFY_TOKEN: z.string(),
  JWT_SECRET_FORGOT_PASSWORD_TOKEN: z.string(),

  PASSWORD_SUFFIX_SECRET: z.string(),
  RESEND_EMAIL_DEBOUNCE_TIME: z.string(),

  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),

  TMDB_API_URL: z.string(),
  TMDB_READ_ACCESS_TOKEN: z.string(),
})

const envProject = envSchema.safeParse(process.env)

if (!envProject.success) {
  throw new Error('Invalid configuration. Please check your .env file.')
}

const envVariables = envProject.data

export default envVariables

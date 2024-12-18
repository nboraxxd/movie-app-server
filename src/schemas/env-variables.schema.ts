import { z } from 'zod'
import { config } from 'dotenv'

config({
  path: '.env',
})

const envSchema = z.object({
  CLIENT_URL: z.string(),
  SERVER_URL: z.string(),

  PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CLUSTER: z.string(),
  DB_NAME: z.string(),

  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: z.string(),
  JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN: z.string(),
  JWT_SECRET_ACCESS_TOKEN: z.string(),
  JWT_SECRET_REFRESH_TOKEN: z.string(),
  JWT_SECRET_EMAIL_VERIFY_TOKEN: z.string(),
  JWT_SECRET_RESET_PASSWORD_TOKEN: z.string(),

  PASSWORD_SUFFIX_SECRET: z.string(),
  RESEND_EMAIL_DEBOUNCE_TIME: z.string(),
  REVIEWS_PER_PAGE_LIMIT: z.coerce.number().int(),
  FAVORITES_PER_PAGE_LIMIT: z.coerce.number().int(),

  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),

  TMDB_API_URL: z.string(),
  TMDB_IMAGE_ORIGINAL_URL: z.string(),
  TMDB_IMAGE_W500_URL: z.string(),
  TMDB_IMAGE_W276_H350_URL: z.string(),
  TMDB_READ_ACCESS_TOKEN: z.string(),

  CLOUDINARY_FOLDER: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_SECRET_KEY: z.string(),

  DOMAIN_ALLOW_LIST: z.string(),
})

const envProject = envSchema.safeParse(process.env)

if (!envProject.success) {
  throw new Error('Invalid configuration. Please check your .env file.')
}

const envVariables = envProject.data

export default envVariables

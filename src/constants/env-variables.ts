import { config } from 'dotenv'

config({
  path: '.env',
})

export const envVariables = {
  PORT: process.env.PORT || 4000,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_CLUSTER: process.env.DB_CLUSTER,
  DB_NAME: process.env.DB_NAME,
}

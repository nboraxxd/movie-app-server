import { config } from 'dotenv'

config({
  path: '.env.development',
})

export const envVariables = {
  PORT: process.env.PORT || 4000,
}

console.log(envVariables)

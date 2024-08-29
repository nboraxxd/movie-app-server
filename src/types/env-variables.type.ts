/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-namespace */
import { z } from 'zod'

const envVariables = z.object({
  PORT: z.string(),
})

const envProject = envVariables.safeParse(process.env)

if (!envProject.success) {
  throw new Error('Invalid configuration. Please check your .env file.')
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

import axios, { AxiosError, AxiosInstance } from 'axios'
import { ErrorWithStatus } from '@/models/errors'
import envVariables from '@/schemas/env-variables.schema'
import { HttpStatusCode, TStatusCode } from '@/constants/http-status-code'

type ErrorData = {
  success: boolean
  status_code: number
  status_message: string
}

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: envVariables.TMDB_API_URL,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${envVariables.TMDB_READ_ACCESS_TOKEN}`,
      },
    })

    this.instance.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error: AxiosError<ErrorData>) => {
        const httpError = new ErrorWithStatus({
          message: error.response ? error.response.data.status_message : error.message,
          statusCode:
            error.response && Object.values(HttpStatusCode).includes(error.response.status as TStatusCode)
              ? (error.response.status as TStatusCode)
              : HttpStatusCode.InternalServerError,
        })

        return Promise.reject(httpError)
      }
    )
  }
}

const http = new Http().instance

export default http

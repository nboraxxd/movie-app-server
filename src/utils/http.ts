import envVariables from '@/schemas/env-variables.schema'
import axios, { AxiosError, AxiosInstance } from 'axios'

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
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http

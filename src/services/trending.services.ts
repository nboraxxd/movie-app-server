import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import { TrendingParamsType, TrendingQueryType, TrendingTMDBResponseType } from '@/schemas/trending.schema'

class TrendingService {
  async getList(payload: TrendingParamsType & TrendingQueryType) {
    const { timeWindow, trendingType, page } = payload

    const response = await http.get<TrendingTMDBResponseType>(`/trending/${trendingType}/${timeWindow}`, {
      params: { page },
    })
    console.log('🔥 ~ TrendingService ~ getList ~ response:', response)

    return {
      data: response.results.map((item) => {
        const backdropFullPath = `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
        const posterFullPath = `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}`

        return { ...item, backdrop_path: backdropFullPath, poster_path: posterFullPath }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const trendingService = new TrendingService()
export default trendingService

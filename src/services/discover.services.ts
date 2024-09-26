import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import { TMDBListResponseType } from '@/schemas/tmdb.schema'
import { DiscoverQueryType, DiscoverType } from '@/schemas/discover.schema'

class DiscoverService {
  async getList(payload: DiscoverType & DiscoverQueryType) {
    const { discoverType, includeAdult, includeVideo, page, sortBy, voteAverageGte, voteAverageLte, withGenres } =
      payload

    const response = await http.get<TMDBListResponseType>(`/discover/${discoverType}`, {
      params: {
        page,
        include_adult: includeAdult,
        include_video: includeVideo,
        sort_by: sortBy,
        'vote_average.gte': voteAverageGte,
        'vote_average.lte': voteAverageLte,
        with_genres: withGenres,
      },
    })

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

const discoverService = new DiscoverService()
export default discoverService

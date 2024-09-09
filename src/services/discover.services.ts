import http from '@/utils/http'
import { TMDBListResponseType } from '@/schemas/tmdb.schema'
import { DiscoverQueryType, MediaType } from '@/schemas/discover.schema'

class DiscoverService {
  async getList(payload: MediaType & DiscoverQueryType) {
    const { mediaType, includeAdult, includeVideo, page, sortBy, voteAverageGte, voteAverageLte, withGenres } = payload

    const response = await http.get<TMDBListResponseType>(`/discover/${mediaType}`, {
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
      data: response.results,
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const discoverService = new DiscoverService()
export default discoverService

import http from '@/utils/http'
import { TMDBListResponseType } from '@/schemas/tmdb.schema'
import { MoviesQueryType } from '@/schemas/movies.schema'

class MoviesService {
  async getPopularMovies({ page }: MoviesQueryType) {
    const response = await http.get<TMDBListResponseType>('/movie/popular', {
      params: { page },
    })

    return {
      data: response.results,
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const moviesService = new MoviesService()
export default moviesService

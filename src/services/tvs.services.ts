import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import { TMDBTopRatedTvResponseType, TopRatedQueryType } from '@/schemas/common-media.schema'
import favoritesService from '@/services/favorites.services'
import { TopRatedTvsResponseType, TVDataType } from '@/schemas/tv.schema'

class TVsService {
  async topRatedTvs({
    page,
    userId,
  }: TopRatedQueryType & { userId?: string }): Promise<Omit<TopRatedTvsResponseType, 'message'>> {
    const response = await http.get<TMDBTopRatedTvResponseType>('/tv/top_rated', { params: { page } })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'tv' })),
      userId,
    })

    return {
      data: response.results.map<Omit<TVDataType, 'mediaType'>>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          genreIds: item.genre_ids,
          backdropPath: backdropFullPath,
          id: item.id,
          originalLanguage: item.original_language,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('tv') ?? false) : null,
          originalName: item.original_name,
          overview: item.overview,
          popularity: item.popularity,
          posterPath: posterFullPath,
          firstAirDate: item.first_air_date,
          name: item.name,
          originalCountry: item.original_country,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const tvsService = new TVsService()
export default tvsService

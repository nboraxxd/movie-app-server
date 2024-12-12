import http from '@/utils/http'
import favoritesService from '@/services/favorites.services'
import envVariables from '@/schemas/env-variables.schema'
import { TVDataType } from '@/schemas/tv.schema'
import {
  TMDBDiscoverMovieResponseType,
  TMDBTopRatedMoviesResponseType,
  TMDBMovieDetailResponseType,
  ProductionCompanyType,
  ProductionCountryType,
  SpokenLanguageType,
  VideoType,
  TMDBRecommendedMoviesResponseType,
  TMDBSearchMoviesResponseType,
  PageQueryType,
  TMDBMovieCreditsResponseType,
  TMDBGenresResponseType,
} from '@/schemas/common-media.schema'
import {
  DiscoverMoviesQueryType,
  DiscoverMoviesResponseType,
  MovieCastType,
  MovieCreditsResponseType,
  MovieCrewType,
  MovieDataType,
  MovieDetailDataType,
  GenresMovieResponseType,
  RecommendedMoviesResponseType,
  SearchMoviesResponseType,
  TopRatedMoviesResponseType,
} from '@/schemas/movies.schema'

class MoviesService {
  async discoverMovies(
    payload: DiscoverMoviesQueryType & { userId?: string }
  ): Promise<Omit<DiscoverMoviesResponseType, 'message'>> {
    const { page, sortBy, voteAverageGte, voteAverageLte, withGenres, userId } = payload

    const response = await http.get<TMDBDiscoverMovieResponseType>('/discover/movie', {
      params: {
        page,
        sort_by: sortBy,
        'vote_average.gte': voteAverageGte,
        'vote_average.lte': voteAverageLte,
        with_genres: withGenres,
      },
    })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'movie' })),
      userId,
    })

    return {
      data: response.results.map<MovieDataType>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          genreIds: item.genre_ids,
          id: item.id,
          mediaType: 'movie',
          originalLanguage: item.original_language,
          originalTitle: item.original_title,
          overview: item.overview,
          popularity: item.popularity,
          releaseDate: item.release_date,
          title: item.title,
          video: item.video,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          backdropPath: backdropFullPath,
          posterPath: posterFullPath,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('movie') ?? false) : null,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async topRatedMovies({
    page,
    userId,
  }: PageQueryType & { userId?: string }): Promise<Omit<TopRatedMoviesResponseType, 'message'>> {
    const response = await http.get<TMDBTopRatedMoviesResponseType>('/movie/top_rated', { params: { page } })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'movie' })),
      userId,
    })

    return {
      data: response.results.map<MovieDataType>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          genreIds: item.genre_ids,
          backdropPath: backdropFullPath,
          id: item.id,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('movie') ?? false) : null,
          mediaType: 'movie',
          originalLanguage: item.original_language,
          originalTitle: item.original_title,
          overview: item.overview,
          popularity: item.popularity,
          posterPath: posterFullPath,
          releaseDate: item.release_date,
          title: item.title,
          video: item.video,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async searchMovies(payload: {
    query: string
    page?: number
    userId?: string
  }): Promise<Omit<SearchMoviesResponseType, 'message'>> {
    const { page, query, userId } = payload

    const response = await http.get<TMDBSearchMoviesResponseType>('/search/movie', {
      params: { page, query },
    })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'movie' })),
      userId,
    })

    return {
      data: response.results.map<MovieDataType>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          genreIds: item.genre_ids,
          id: item.id,
          mediaType: 'movie',
          originalLanguage: item.original_language,
          originalTitle: item.original_title,
          overview: item.overview,
          popularity: item.popularity,
          releaseDate: item.release_date,
          title: item.title,
          video: item.video,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          backdropPath: backdropFullPath,
          posterPath: posterFullPath,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('movie') ?? false) : null,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async getMovieDetail(movieId: number): Promise<MovieDetailDataType> {
    const response = await http.get<TMDBMovieDetailResponseType>(`/movie/${movieId}`, {
      params: { append_to_response: 'release_dates,videos' },
    })

    const certification =
      response.release_dates.results.find((item) => item.iso_3166_1 === 'US')?.release_dates[0].certification || null

    const backdropFullPath = response.backdrop_path
      ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${response.backdrop_path}`
      : null
    const posterFullPath = response.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${response.poster_path}` : null

    return {
      adult: response.adult,
      backdropPath: backdropFullPath,
      belongsToCollection: response.belongs_to_collection
        ? {
            backdropPath: response.belongs_to_collection.backdrop_path,
            id: response.belongs_to_collection.id,
            name: response.belongs_to_collection.name,
            posterPath: response.belongs_to_collection.poster_path,
          }
        : null,
      budget: response.budget,
      certification,
      genres: response.genres,
      homepage: response.homepage,
      id: response.id,
      imdbId: response.imdb_id,
      originCountry: response.origin_country,
      originalLanguage: response.original_language,
      originalTitle: response.original_title,
      overview: response.overview,
      popularity: response.popularity,
      posterPath: posterFullPath,
      productionCompanies: response.production_companies.map<ProductionCompanyType>((item) => ({
        id: item.id,
        logoPath: item.logo_path,
        name: item.name,
        originCountry: item.origin_country,
      })),
      productionCountries: response.production_countries.map<ProductionCountryType>((item) => ({
        iso31661: item.iso_3166_1,
        name: item.name,
      })),
      releaseDate: response.release_date,
      revenue: response.revenue,
      runtime: response.runtime,
      spokenLanguages: response.spoken_languages.map<SpokenLanguageType>((item) => ({
        englishName: item.english_name,
        iso6391: item.iso_639_1,
        name: item.name,
      })),
      status: response.status,
      tagline: response.tagline,
      title: response.title,
      videos: {
        results: response.videos.results.map<VideoType>((item) => ({
          id: item.id,
          iso6391: item.iso_639_1,
          iso31661: item.iso_3166_1,
          key: item.key,
          name: item.name,
          site: item.site,
          official: item.official,
          publishedAt: item.published_at,
          size: item.size,
          type: item.type,
        })),
      },
      video: response.video,
      voteAverage: response.vote_average,
      voteCount: response.vote_count,
    }
  }

  async getMovieCredits(movieId: number): Promise<MovieCreditsResponseType['data']> {
    const response = await http.get<TMDBMovieCreditsResponseType>(`/movie/${movieId}/credits`)

    const formattedCrew = response.crew.map<MovieCrewType>((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null
      return {
        adult: item.adult,
        creditId: item.credit_id,
        department: item.department,
        gender: item.gender,
        id: item.id,
        job: item.job,
        knownForDepartment: item.known_for_department,
        name: item.name,
        originalName: item.original_name,
        popularity: item.popularity,
        profilePath: profileFullPath,
      }
    })

    const formattedCast = response.cast.map<MovieCastType>((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null
      return {
        adult: item.adult,
        castId: item.cast_id,
        character: item.character,
        creditId: item.credit_id,
        gender: item.gender,
        id: item.id,
        knownForDepartment: item.known_for_department,
        name: item.name,
        order: item.order,
        originalName: item.original_name,
        popularity: item.popularity,
        profilePath: profileFullPath,
      }
    })

    return { cast: formattedCast, crew: formattedCrew }
  }

  async getRecommendedMovies(payload: {
    movieId: number
    page?: number
    userId: string | undefined
  }): Promise<Omit<RecommendedMoviesResponseType, 'message'>> {
    const { movieId, page, userId } = payload

    const response = await http.get<TMDBRecommendedMoviesResponseType>(`/movie/${movieId}/recommendations`, {
      params: { page },
    })

    const movieFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'movie' })),
      userId,
    })

    return {
      data: response.results.map<MovieDataType | TVDataType>((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return item.media_type === 'movie'
          ? {
              mediaType: 'movie',
              adult: item.adult,
              backdropPath: backdropFullPath,
              genreIds: item.genre_ids,
              id: item.id,
              isFavorite: userId ? (movieFavoritesMap[item.id]?.includes('movie') ?? false) : null,
              originalLanguage: item.original_language,
              originalTitle: item.original_title,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterFullPath,
              releaseDate: item.release_date,
              title: item.title,
              video: item.video,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
            }
          : {
              mediaType: 'tv',
              adult: item.adult,
              backdropPath: backdropFullPath,
              genreIds: item.genre_ids,
              id: item.id,
              firstAirDate: item.first_air_date,
              isFavorite: userId ? (movieFavoritesMap[item.id]?.includes('tv') ?? false) : null,
              name: item.name,
              originCountry: item.origin_country,
              originalLanguage: item.original_language,
              overview: item.overview,
              originalName: item.original_name,
              popularity: item.popularity,
              posterPath: posterFullPath,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
            }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async getMovieGenres(): Promise<GenresMovieResponseType['data']> {
    const response = await http.get<TMDBGenresResponseType>('/genre/movie/list')

    return response.genres
  }
}

const moviesService = new MoviesService()
export default moviesService

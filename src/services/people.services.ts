import http from '@/utils/http'
import { buildTMDBImageUrl } from '@/utils/common'
import {
  GetPersonCombinedCreditsResponseType,
  GetPersonDetailResponseType,
  PersonDataType,
  SearchPeopleResponseType,
} from '@/schemas/people.schema'
import {
  TMDBPersonCombinedCreditsResponseType,
  TMDBPersonDetailResponseType,
  TMDBSearchPeopleResponseType,
} from '@/schemas/common-media.schema'

class PeopleService {
  async searchPeople(payload: { query: string; page?: number }): Promise<Omit<SearchPeopleResponseType, 'message'>> {
    const { page, query } = payload

    const response = await http.get<TMDBSearchPeopleResponseType>('/search/person', {
      params: { page, query },
    })

    return {
      data: response.results.map<PersonDataType>(({ known_for_department, original_name, profile_path, ...item }) => {
        return {
          adult: item.adult,
          gender: item.gender,
          id: item.id,
          knownForDepartment: known_for_department,
          name: item.name,
          originalName: original_name,
          popularity: item.popularity,
          profilePath: buildTMDBImageUrl({ imagePath: profile_path, imageType: 'profile' }),
          mediaType: 'person',
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async getPersonDetail(personId: number): Promise<GetPersonDetailResponseType['data']> {
    const result = await http.get<TMDBPersonDetailResponseType>(`/person/${personId}`, {
      params: { append_to_response: 'release_dates,credits,videos' },
    })

    return {
      adult: result.adult,
      alsoKnownAs: result.also_known_as,
      biography: result.biography,
      birthday: result.birthday,
      deathday: result.deathday,
      gender: result.gender,
      homepage: result.homepage,
      id: result.id,
      imdbId: result.imdb_id,
      knownForDepartment: result.known_for_department,
      name: result.name,
      placeOfBirth: result.place_of_birth,
      popularity: result.popularity,
      profilePath: buildTMDBImageUrl({ imagePath: result.profile_path, imageType: 'profile' }),
    }
  }

  async getPersonCombinedCredits(personId: number): Promise<GetPersonCombinedCreditsResponseType['data']> {
    const result = await http.get<TMDBPersonCombinedCreditsResponseType>(`/person/${personId}/combined_credits`)

    return {
      cast: result.cast.map((item) => {
        const backdropUrl = buildTMDBImageUrl({ imagePath: item.backdrop_path, imageType: 'backdrop' })
        const posterUrl = buildTMDBImageUrl({ imagePath: item.poster_path, imageType: 'poster' })

        return item.media_type === 'movie'
          ? {
              mediaType: item.media_type,
              adult: item.adult,
              backdropPath: backdropUrl,
              genreIds: item.genre_ids,
              id: item.id,
              originalLanguage: item.original_language,
              originalTitle: item.original_title,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterUrl,
              releaseDate: item.release_date,
              title: item.title,
              video: item.video,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
              character: item.character,
              creditId: item.credit_id,
              order: item.order,
            }
          : {
              mediaType: item.media_type,
              adult: item.adult,
              backdropPath: backdropUrl,
              firstAirDate: item.first_air_date,
              genreIds: item.genre_ids,
              id: item.id,
              name: item.name,
              originCountry: item.origin_country,
              originalLanguage: item.original_language,
              originalName: item.original_name,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterUrl,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
              character: item.character,
              creditId: item.credit_id,
              episodeCount: item.episode_count,
            }
      }),
      crew: result.crew.map((item) => {
        const backdropUrl = buildTMDBImageUrl({ imagePath: item.backdrop_path, imageType: 'backdrop' })
        const posterUrl = buildTMDBImageUrl({ imagePath: item.poster_path, imageType: 'poster' })

        return item.media_type === 'movie'
          ? {
              mediaType: item.media_type,
              adult: item.adult,
              backdropPath: backdropUrl,
              genreIds: item.genre_ids,
              id: item.id,
              originalLanguage: item.original_language,
              originalTitle: item.original_title,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterUrl,
              releaseDate: item.release_date,
              title: item.title,
              video: item.video,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
              creditId: item.credit_id,
              department: item.department,
              job: item.job,
            }
          : {
              mediaType: item.media_type,
              adult: item.adult,
              backdropPath: backdropUrl,
              firstAirDate: item.first_air_date,
              genreIds: item.genre_ids,
              id: item.id,
              name: item.name,
              originCountry: item.origin_country,
              originalLanguage: item.original_language,
              originalName: item.original_name,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterUrl,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
              creditId: item.credit_id,
              department: item.department,
              episodeCount: item.episode_count,
              job: item.job,
            }
      }),
    }
  }
}

const peopleService = new PeopleService()
export default peopleService

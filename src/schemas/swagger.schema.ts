/**
 * @swagger
 * components:
 *  schemas:
 *   registerBodySchema:
 *    required:
 *    - name
 *    - email
 *    - password
 *    - confirmPassword
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: brucewayne@wayne-ent.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirmPassword:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   emailVerifyTokenSchema:
 *    required:
 *    - emailVerifyToken
 *    type: object
 *    properties:
 *     emailVerifyToken:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   loginBodySchema:
 *    required:
 *    - email
 *    - password
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: brucewayne@wayne-ent.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   refreshTokenSchema:
 *    required:
 *    - refreshToken
 *    type: object
 *    properties:
 *     refreshToken:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   avatarFileSchema:
 *    required:
 *    - avatar
 *    type: object
 *    properties:
 *     avatar:
 *      type: string
 *      format: binary
 *      example: avatar.jpg
 *
 *   dataAuthResponseSchema:
 *    type: object
 *    properties:
 *     accessToken:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     refreshToken:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   dataGetProfileResponseSchema:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: brucewayne@wayne-ent.dc
 *     avatar:
 *      type: string
 *      nullable: true
 *      example: https://www.wayne-ent.dc/brucewayne.jpg
 *     isVerified:
 *      type: boolean
 *      example: true
 *     createdAt:
 *      type: string
 *      format: ISO 8601
 *      example: 2025-02-19T08:46:24.000Z
 *     updatedAt:
 *      type: string
 *      format: ISO 8601
 *      example: 2025-02-19T08:46:24.000Z
 *
 *   paginationResponseSchema:
 *    type: object
 *    properties:
 *     currentPage:
 *      type: integer
 *      example: 1
 *     totalPages:
 *      type: integer
 *      example: 10
 *     count:
 *      type: integer
 *      example: 100
 *
 *   movieItemSchema:
 *    type: object
 *    properties:
 *     adult:
 *      type: boolean
 *      example: false
 *     backdropPath:
 *      type: string
 *      nullable: true
 *      example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     genreIds:
 *      type: array
 *      items:
 *       type: integer
 *      example: [878, 53, 18, 27]
 *     id:
 *      type: integer
 *      example: 1125510
 *     mediaType:
 *      type: string
 *      enum:
 *      - movie
 *      example: "movie"
 *     originalLanguage:
 *      type: string
 *      example: "es"
 *     originalTitle:
 *      type: string
 *      example: "El hoyo 2"
 *     isFavorite:
 *      type: boolean
 *      nullable: true
 *      example: false
 *     overview:
 *      type: string
 *      example: "After a mysterious..."
 *     popularity:
 *      type: number
 *      format: float
 *      example: 477.147
 *     posterPath:
 *      type: string
 *      example: "https://image.tmdb.org/t/p/w500/izuzUb0sDokqp9o8utVfsrSJuy5.jpg"
 *     releaseDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     title:
 *      type: string
 *      example: "The Platform 2"
 *     video:
 *      type: boolean
 *      example: false
 *     voteAverage:
 *      type: number
 *      format: float
 *      example: 5.7
 *     voteCount:
 *      type: integer
 *      example: 219
 *
 *   tvItemSchema:
 *    type: object
 *    properties:
 *     adult:
 *      type: boolean
 *      example: false
 *     backdropPath:
 *      type: string
 *      nullable: true
 *      example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     firstAirDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     genreIds:
 *      type: array
 *      items:
 *       type: integer
 *      example: [878, 53, 18, 27]
 *     id:
 *      type: integer
 *      example: 1125510
 *     name:
 *      type: string
 *      example: "The Platform 2"
 *     mediaType:
 *      type: string
 *      enum:
 *      - tv
 *      example: "tv"
 *     originalCountry:
 *      type: array
 *      items:
 *       type: string
 *       example: ["US", "GB"]
 *     originalLanguage:
 *      type: string
 *      example: "es"
 *     originalName:
 *      type: string
 *      example: "El hoyo 2"
 *     isFavorite:
 *      type: boolean
 *      nullable: true
 *      example: false
 *     overview:
 *      type: string
 *      example: "After a mysterious..."
 *     popularity:
 *      type: number
 *      format: float
 *      example: 477.147
 *     posterPath:
 *      type: string
 *      example: "https://image.tmdb.org/t/p/w500/izuzUb0sDokqp9o8utVfsrSJuy5.jpg"
 *     voteAverage:
 *      type: number
 *      format: float
 *      example: 5.7
 *     voteCount:
 *      type: integer
 *      example: 219
 *
 *   dataTrendingResponseSchema:
 *    type: array
 *    items:
 *     oneOf:
 *     - $ref: '#/components/schemas/movieItemSchema'
 *     - $ref: '#/components/schemas/tvItemSchema'
 *
 *   dataRecommendedResponseSchema:
 *    type: array
 *    items:
 *     oneOf:
 *      - $ref: '#/components/schemas/movieItemSchema'
 *      - $ref: '#/components/schemas/tvItemSchema'
 *
 *   dataDiscoverMoviesResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/movieItemSchema'
 *
 *   dataTopRatedMoviesResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/movieItemSchema'
 *
 *   movieDetailDataSchema:
 *    type: object
 *    properties:
 *     adult:
 *      type: boolean
 *      example: false
 *     backdropPath:
 *      type: string
 *      nullable: true
 *      example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     id:
 *      type: integer
 *      example: 1125510
 *     originalLanguage:
 *      type: string
 *      example: "es"
 *     originalTitle:
 *      type: string
 *      example: "El hoyo 2"
 *     isFavorite:
 *      type: boolean
 *      nullable: true
 *      example: false
 *     overview:
 *      type: string
 *      example: "After a mysterious..."
 *     popularity:
 *      type: number
 *      format: float
 *      example: 477.147
 *     posterPath:
 *      type: string
 *      example: "https://image.tmdb.org/t/p/w500/izuzUb0sDokqp9o8utVfsrSJuy5.jpg"
 *     releaseDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     title:
 *      type: string
 *      example: "The Platform 2"
 *     video:
 *      type: boolean
 *      example: false
 *     voteAverage:
 *      type: number
 *      format: float
 *      example: 5.7
 *     voteCount:
 *      type: integer
 *      example: 219
 *     belongsToCollection:
 *      type: object
 *      properties:
 *       id:
 *        type: integer
 *        example: 123
 *       name:
 *        type: string
 *        example: "The Dark Knight Collection"
 *       posterPath:
 *        type: string
 *        nullable: true
 *        example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *       backdropPath:
 *        type: string
 *        nullable: true
 *        example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     budget:
 *      type: integer
 *      example: 185000000
 *     genres:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         example: 28
 *        name:
 *         type: string
 *         example: "Action"
 *     homepage:
 *      type: string
 *      nullable: true
 *      example: "https://www.thedarkknight.com"
 *     imdbId:
 *      type: string
 *      nullable: true
 *      example: "https://www.thedarkknight.com"
 *     originalCountry:
 *      type: array
 *      items:
 *       type: string
 *       example: "US"
 *     productionCompanies:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         example: 28
 *        name:
 *         type: string
 *         example: "Action"
 *        logoPath:
 *         type: string
 *         nullable: true
 *         example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *        originalCountry:
 *         type: string
 *         example: "US"
 *     productionCountries:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "Action"
 *        iso31661:
 *         type: string
 *         example: "US"
 *     revenue:
 *      type: integer
 *      example: 1000000000
 *     runtime:
 *      type: integer
 *      nullable: true
 *      example: 152
 *     spokenLanguages:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "English"
 *        iso6391:
 *         type: string
 *         example: "en"
 *        englishName:
 *         type: string
 *         example: "English"
 *     status:
 *      type: string
 *      example: "Released"
 *     tagline:
 *      type: string
 *      nullable: true
 *      example: "Why so serious?"
 *     credits:
 *      type: object
 *      properties:
 *       cast:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          adult:
 *           type: boolean
 *           example: false
 *          gender:
 *           type: integer
 *           nullable: true
 *           example: 2
 *          id:
 *           type: integer
 *           example: 123
 *          knownForDepartment:
 *           type: string
 *           example: "Acting"
 *          name:
 *           type: string
 *           example: "Christian Bale"
 *          originalName:
 *           type: string
 *           example: "Christian Bale"
 *          popularity:
 *           type: number
 *           format: float
 *           example: 10.0
 *          profilePath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *          castId:
 *           type: integer
 *           example: 1
 *          character:
 *           type: string
 *           example: "Bruce Wayne / Batman"
 *          creditId:
 *           type: string
 *           example: "52fe4232c3a36847f800b579"
 *          order:
 *           type: integer
 *           example: 0
 *       crew:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          adult:
 *           type: boolean
 *           example: false
 *          gender:
 *           type: integer
 *           nullable: true
 *           example: 2
 *          id:
 *           type: integer
 *           example: 123
 *          knownForDepartment:
 *           type: string
 *           example: "Directing"
 *          name:
 *           type: string
 *           example: "Christopher Nolan"
 *          originalName:
 *           type: string
 *           example: "Christopher Nolan"
 *          popularity:
 *           type: number
 *           format: float
 *           example: 10.0
 *          profilePath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *          creditId:
 *           type: string
 *           example: "52fe4232c3a36847f800b579"
 *          department:
 *           type: string
 *           example: "Directing"
 *          job:
 *           type: string
 *           example: "Director"
 *     videos:
 *      type: object
 *      properties:
 *       results:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *           type: string
 *           example: "5f4c3b7e9251410034f3e3b4"
 *          iso6391:
 *           type: string
 *           example: "en"
 *          iso31661:
 *           type: string
 *           example: "US"
 *          name:
 *           type: string
 *           example: "The Dark Knight"
 *          key:
 *           type: string
 *           example: "5f4c3b7e9251410034f3e3b4"
 *          site:
 *           type: string
 *           example: "YouTube"
 *          size:
 *           type: integer
 *           example: 1080
 *          type:
 *           type: string
 *           example: "Trailer"
 *          official:
 *           type: boolean
 *           example: true
 *          publishedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-09-27T08:46:24.000Z"
 *     certification:
 *      type: string
 *      nullable: true
 *      example: "PG-13"
 *
 *   dataDiscoverTvsResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/tvItemSchema'
 *
 *   dataTopRatedTvsResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/tvItemSchema'
 *
 *   tvDetailDataSchema:
 *    type: object
 *    properties:
 *     adult:
 *      type: boolean
 *      example: false
 *     backdropPath:
 *      type: string
 *      nullable: true
 *      example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     firstAirDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     id:
 *      type: integer
 *      example: 1125510
 *     name:
 *      type: string
 *      example: "The Platform 2"
 *     originalCountry:
 *      type: array
 *      items:
 *       type: string
 *       example: ["US", "GB"]
 *     originalLanguage:
 *      type: string
 *      example: "es"
 *     originalName:
 *      type: string
 *      example: "El hoyo 2"
 *     isFavorite:
 *      type: boolean
 *      nullable: true
 *      example: false
 *     overview:
 *      type: string
 *      example: "After a mysterious..."
 *     popularity:
 *      type: number
 *      format: float
 *      example: 477.147
 *     posterPath:
 *      type: string
 *      example: "https://image.tmdb.org/t/p/w500/izuzUb0sDokqp9o8utVfsrSJuy5.jpg"
 *     voteAverage:
 *      type: number
 *      format: float
 *      example: 5.7
 *     voteCount:
 *      type: integer
 *      example: 219
 *     createdBy:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         example: 123
 *        creditId:
 *         type: string
 *         example: "52fe4232c3a36847f800b579"
 *        name:
 *         type: string
 *         example: "Christopher Nolan"
 *        originalName:
 *         type: string
 *         example: "Christopher Nolan"
 *        gender:
 *         type: integer
 *         nullable: true
 *         example: 2
 *        profilePath:
 *         type: string
 *         nullable: true
 *         example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     episodeRunTime:
 *      type: array
 *      items:
 *       type: integer
 *      example: [45, 60]
 *     genres:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         example: 28
 *        name:
 *         type: string
 *         example: "Action"
 *     homepage:
 *      type: string
 *      nullable: true
 *      example: "https://www.thedarkknight.com"
 *     inProduction:
 *      type: boolean
 *      example: true
 *     languages:
 *      type: array
 *      items:
 *       type: string
 *       example: "English"
 *     lastAirDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     lastEpisodeToAir:
 *      type: object
 *      nullable: true
 *      properties:
 *       id:
 *        type: integer
 *        example: 123
 *       name:
 *        type: string
 *        example: "The Dark Knight"
 *       overview:
 *        type: string
 *        example: "After a mysterious..."
 *       voteAverage:
 *        type: number
 *        format: float
 *        example: 5.7
 *       voteCount:
 *        type: integer
 *        example: 219
 *       airDate:
 *        type: string
 *        format: date
 *        example: "2024-09-27"
 *       episodeNumber:
 *        type: integer
 *        example: 1
 *       episodeType:
 *        type: string
 *        example: "Regular"
 *       productionCode:
 *        type: string
 *        example: "TMDb"
 *       runtime:
 *        type: integer
 *        example: 45
 *       seasonNumber:
 *        type: integer
 *        example: 1
 *       showId:
 *        type: integer
 *        example: 1125510
 *       stillPath:
 *        type: string
 *        nullable: true
 *        example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     nextEpisodeToAir:
 *      type: object
 *      nullable: true
 *      properties:
 *       id:
 *        type: integer
 *        example: 123
 *       name:
 *        type: string
 *        example: "The Dark Knight"
 *       overview:
 *        type: string
 *        example: "After a mysterious..."
 *       voteAverage:
 *        type: number
 *        format: float
 *        example: 5.7
 *       voteCount:
 *        type: integer
 *        example: 219
 *       airDate:
 *        type: string
 *        format: date
 *        example: "2024-09-27"
 *       episodeNumber:
 *        type: integer
 *        example: 1
 *       episodeType:
 *        type: string
 *        example: "Regular"
 *       productionCode:
 *        type: string
 *        example: "TMDb"
 *       runtime:
 *        type: integer
 *        example: 45
 *       seasonNumber:
 *        type: integer
 *        example: 1
 *       showId:
 *        type: integer
 *        example: 1125510
 *       stillPath:
 *        type: string
 *        nullable: true
 *        example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *     networks:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "HBO"
 *        id:
 *         type: integer
 *         example: 123
 *        logoPath:
 *         type: string
 *         nullable: true
 *         example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *        originCountry:
 *         type: string
 *         example: "US"
 *     numberOfEpisodes:
 *      type: integer
 *      example: 10
 *     numberOfSeasons:
 *      type: integer
 *      example: 1
 *     productionCompanies:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         example: 28
 *        name:
 *         type: string
 *         example: "Action"
 *        logoPath:
 *         type: string
 *         nullable: true
 *         example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *        originCountry:
 *         type: string
 *         example: "US"
 *     productionCountries:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "Action"
 *        iso31661:
 *         type: string
 *         example: "US"
 *     seasons:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        airDate:
 *         type: string
 *         nullable: true
 *         format: date
 *         example: "2024-09-27"
 *        episodeCount:
 *         type: integer
 *         example: 10
 *        id:
 *         type: integer
 *         example: 123
 *        name:
 *         type: string
 *         example: "Season 1"
 *        overview:
 *         type: string
 *         example: "After a mysterious..."
 *        posterPath:
 *         type: string
 *         nullable: true
 *         example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *        seasonNumber:
 *         type: integer
 *         example: 1
 *        voteAverage:
 *         type: number
 *         format: float
 *         example: 5.7
 *     status:
 *      type: string
 *      example: "Released"
 *     type:
 *      type: string
 *      example: "Scripted"
 *     videos:
 *      type: object
 *      properties:
 *       results:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *           type: string
 *           example: "5f4c3b7e9251410034f3e3b4"
 *          iso6391:
 *           type: string
 *           example: "en"
 *          iso31661:
 *           type: string
 *           example: "US"
 *          name:
 *           type: string
 *           example: "The Dark Knight"
 *          key:
 *           type: string
 *           example: "5f4c3b7e9251410034f3e3b4"
 *          site:
 *           type: string
 *           example: "YouTube"
 *          size:
 *           type: integer
 *           example: 1080
 *          type:
 *           type: string
 *           example: "Trailer"
 *          official:
 *           type: boolean
 *           example: true
 *          publishedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-09-27T08:46:24.000Z"
 *     aggregateCredits:
 *      type: object
 *      properties:
 *       cast:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          adult:
 *           type: boolean
 *           example: false
 *          gender:
 *           type: integer
 *           nullable: true
 *           example: 2
 *          id:
 *           type: integer
 *           example: 123
 *          knownForDepartment:
 *           type: string
 *           example: "Acting"
 *          name:
 *           type: string
 *           example: "Christian Bale"
 *          order:
 *           type: integer
 *           example: 0
 *          originalName:
 *           type: string
 *           example: "Christian Bale"
 *          popularity:
 *           type: number
 *           format: float
 *           example: 10.0
 *          profilePath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *          roles:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             creditId:
 *              type: string
 *              example: "52fe4232c3a36847f800b579"
 *             character:
 *              type: string
 *              example: "Bruce Wayne / Batman"
 *             episodeCount:
 *              type: integer
 *              example: 1
 *          totalEpisodeCount:
 *           type: integer
 *           example: 1
 *       crew:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          adult:
 *           type: boolean
 *           example: false
 *          department:
 *           type: string
 *           example: "Directing"
 *          gender:
 *           type: integer
 *           nullable: true
 *           example: 2
 *          id:
 *           type: integer
 *           example: 123
 *          jobs:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             creditId:
 *              type: string
 *              example: "52fe4232c3a36847f800b579"
 *             job:
 *              type: string
 *              example: "Director"
 *             episodeCount:
 *              type: integer
 *              example: 1
 *          knownForDepartment:
 *           type: string
 *           example: "Acting"
 *          name:
 *           type: string
 *           example: "Christian Bale"
 *          originalName:
 *           type: string
 *           example: "Christian Bale"
 *          popularity:
 *           type: number
 *           format: float
 *           example: 10.0
 *          profilePath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *          totalEpisodeCount:
 *           type: integer
 *           example: 1
 *     certification:
 *      type: string
 *      nullable: true
 *      example: "PG-13"
 *
 *   commentDataResponseSchema:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     mediaId:
 *      type: integer
 *      example: 123
 *     mediaTitle:
 *      type: string
 *      example: "The Dark Knight"
 *     mediaType:
 *      type: string
 *      enum:
 *      - movie
 *      - tv
 *      example: "movie"
 *     mediaPoster:
 *      type: string
 *      nullable: true
 *      example: "https://www.thedarkknight.com"
 *     mediaReleaseDate:
 *      type: string
 *      format: date
 *      example: "2024-09-27"
 *     content:
 *      type: string
 *      example: "Amazing movie!"
 *      minLength: 1
 *      maxLength: 500
 *     createdAt:
 *      type: string
 *      format: date-time
 *      example: "2025-02-19T08:46:24.000Z"
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      example: "2025-02-19T08:46:24.000Z"
 *
 *   addCommentBodySchema:
 *    required:
 *    - mediaId
 *    - mediaTitle
 *    - mediaType
 *    - mediaReleaseDate
 *    - content
 *    type: object
 *    properties:
 *     mediaId:
 *      type: integer
 *      example: 155
 *     mediaTitle:
 *      type: string
 *      example: "The Dark Knight"
 *     mediaType:
 *      type: string
 *      enum:
 *      - movie
 *      - tv
 *      example: "movie"
 *     mediaPoster:
 *      type: string
 *      nullable: true
 *      example: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
 *     mediaReleaseDate:
 *      type: string
 *      format: date
 *      example: "2008-07-16"
 *     content:
 *      type: string
 *      example: "Amazing movie!"
 *      minLength: 1
 *      maxLength: 500
 *
 *   commentExtendDataResponseSchema:
 *    allOf:
 *    - $ref: '#/components/schemas/commentDataResponseSchema'
 *    - type: object
 *      properties:
 *       user:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 123abc...
 *         name:
 *          type: string
 *          example: Bruce Wayne
 *         email:
 *          type: string
 *          example: brucewayne@wayne-ent.dc
 *         avatar:
 *          type: string
 *          nullable: true
 *          example: https://www.wayne-ent.dc/brucewayne.jpg
 *         isVerified:
 *          type: boolean
 *          example: true
 *
 *   addFavoriteBodySchema:
 *    required:
 *    - mediaId
 *    - mediaTitle
 *    - mediaType
 *    - mediaPoster
 *    - mediaReleaseDate
 *    type: object
 *    properties:
 *     mediaId:
 *      type: integer
 *      example: 155
 *     mediaTitle:
 *      type: string
 *      example: "The Dark Knight"
 *     mediaType:
 *      type: string
 *      enum:
 *      - movie
 *      - tv
 *      example: "movie"
 *     mediaPoster:
 *      type: string
 *      example: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
 *     mediaReleaseDate:
 *      type: string
 *      format: date
 *      example: "2008-07-16"
 *     createdAt:
 *      type: string
 *      format: date-time
 *      example: "2025-02-19T08:46:24.000Z"
 *
 *   favoriteDataResponseSchema:
 *    type: object
 *    nullable: true
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     mediaId:
 *      type: integer
 *      example: 155
 *     mediaTitle:
 *      type: string
 *      example: "The Dark Knight"
 *     mediaType:
 *      type: string
 *      enum:
 *      - movie
 *      - tv
 *      example: "movie"
 *     mediaPoster:
 *      type: string
 *      nullable: true
 *      example: https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg
 *     mediaReleaseDate:
 *      type: string
 *      format: date
 *      example: "2008-07-16"
 *     createdAt:
 *      type: string
 *      format: date-time
 *      example: "2025-02-19T08:46:24.000Z"
 *
 *   updateProfileBodySchema:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     avatar:
 *      type: string
 *      example: https://www.wayne-ent.dc/brucewayne.jpg
 */

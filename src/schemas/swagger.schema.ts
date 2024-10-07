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
 *   mediaItemSchema:
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
 *   dataTrendingResponseSchema:
 *    type: array
 *    items:
 *     allOf:
 *      - $ref: '#/components/schemas/mediaItemSchema'
 *      - type: object
 *        properties:
 *         mediaType:
 *          type: string
 *          enum:
 *          - movie
 *          - tv
 *          example: "movie"
 *
 *   dataDiscoverMoviesResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/mediaItemSchema'
 *
 *   dataTopRatedMoviesResponseSchema:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/mediaItemSchema'
 *
 *   movieDetailDataSchema:
 *    allOf:
 *     - $ref: '#/components/schemas/mediaItemSchema'
 *     - type: object
 *       properties:
 *        belongsToCollection:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           example: 123
 *          name:
 *           type: string
 *           example: "The Dark Knight Collection"
 *          posterPath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *          backdropPath:
 *           type: string
 *           nullable: true
 *           example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *        budget:
 *         type: integer
 *         example: 185000000
 *        genres:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           id:
 *            type: integer
 *            example: 28
 *           name:
 *            type: string
 *            example: "Action"
 *         example: [{ "id": 28, "name": "Action" }]
 *        homepage:
 *         type: string
 *         nullable: true
 *         example: "https://www.thedarkknight.com"
 *        imdbId:
 *         type: string
 *         nullable: true
 *         example: "https://www.thedarkknight.com"
 *        originalCountry:
 *         type: array
 *         items:
 *          type: string
 *         example: ["US", "GB"]
 *        productionCompanies:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           id:
 *            type: integer
 *            example: 28
 *           name:
 *            type: string
 *            example: "Action"
 *           logoPath:
 *            type: string
 *            nullable: true
 *            example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *           originCountry:
 *            type: string
 *            example: "US"
 *        productionCountries:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           name:
 *            type: string
 *            example: "Action"
 *           iso31661:
 *            type: string
 *            example: "US"
 *        revenue:
 *         type: integer
 *         example: 1000000000
 *        runtime:
 *         type: integer
 *         nullable: true
 *         example: 152
 *        spokenLanguages:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           name:
 *            type: string
 *            example: "English"
 *           iso6391:
 *            type: string
 *            example: "en"
 *           englishName:
 *            type: string
 *            example: "English"
 *        status:
 *         type: string
 *         example: "Released"
 *        tagline:
 *         type: string
 *         nullable: true
 *         example: "Why so serious?"
 *        credits:
 *         type: object
 *         properties:
 *          cast:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             adult:
 *              type: boolean
 *              example: false
 *             gender:
 *              type: integer
 *              nullable: true
 *              example: 2
 *             id:
 *              type: integer
 *              example: 123
 *             knownForDepartment:
 *              type: string
 *              example: "Acting"
 *             name:
 *              type: string
 *              example: "Christian Bale"
 *             originalName:
 *              type: string
 *              example: "Christian Bale"
 *             popularity:
 *              type: number
 *              format: float
 *              example: 10.0
 *             profilePath:
 *              type: string
 *              nullable: true
 *              example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *             castId:
 *              type: integer
 *              example: 1
 *             character:
 *              type: string
 *              example: "Bruce Wayne / Batman"
 *             creditId:
 *              type: string
 *              example: "52fe4232c3a36847f800b579"
 *             order:
 *              type: integer
 *              example: 0
 *          crew:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             adult:
 *              type: boolean
 *              example: false
 *             gender:
 *              type: integer
 *              nullable: true
 *              example: 2
 *             id:
 *              type: integer
 *              example: 123
 *             knownForDepartment:
 *              type: string
 *              example: "Directing"
 *             name:
 *              type: string
 *              example: "Christopher Nolan"
 *             originalName:
 *              type: string
 *              example: "Christopher Nolan"
 *             popularity:
 *              type: number
 *              format: float
 *              example: 10.0
 *             profilePath:
 *              type: string
 *              nullable: true
 *              example: "https://image.tmdb.org/t/p/original/3m0j3hCS8kMAaP9El6Vy5Lqnyft.jpg"
 *             creditId:
 *              type: string
 *              example: "52fe4232c3a36847f800b579"
 *             department:
 *              type: string
 *              example: "Directing"
 *             job:
 *              type: string
 *              example: "Director"
 *        videos:
 *         type: object
 *         properties:
 *          results:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             id:
 *              type: string
 *              example: "5f4c3b7e9251410034f3e3b4"
 *             iso6391:
 *              type: string
 *              example: "en"
 *             iso31661:
 *              type: string
 *              example: "US"
 *             name:
 *              type: string
 *              example: "The Dark Knight"
 *             key:
 *              type: string
 *              example: "5f4c3b7e9251410034f3e3b4"
 *             site:
 *              type: string
 *              example: "YouTube"
 *             size:
 *              type: integer
 *              example: 1080
 *             type:
 *              type: string
 *              example: "Trailer"
 *             official:
 *              type: boolean
 *              example: true
 *             publishedAt:
 *              type: string
 *              format: date-time
 *              example: "2024-09-27T08:46:24.000Z"
 *        certification:
 *         type: string
 *         nullable: true
 *         example: "PG-13"
 */

import { Collection, Db, MongoClient } from 'mongodb'

import envVariables from '@/schemas/env-variables.schema'
import User from '@/models/user.model'
import Comment from '@/models/comment.model'
import Favorite from '@/models/favorite.model'
import RefreshToken from '@/models/refresh-token.model'

const uri = `mongodb+srv://${envVariables.DB_USERNAME}:${envVariables.DB_PASSWORD}@movie-app-singapore.s0ve5.mongodb.net/?retryWrites=true&w=majority&appName=${envVariables.DB_CLUSTER}`

class DatabaseService {
  private db: Db
  client: MongoClient

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envVariables.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('🎉 Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('😥 Error', error)
      throw error
    }
  }

  async setupUsersCollection() {
    const isExistCollection = await this.db.listCollections({ name: 'users' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('users', {
        validator: {
          $jsonSchema: {
            title: 'Users Schema',
            bsonType: 'object',
            required: ['name', 'email', 'password', 'createdAt', 'updatedAt'],
            properties: {
              _id: {
                bsonType: 'objectId',
                description: 'Unique identifier for the user',
              },
              name: {
                bsonType: 'string',
                description: 'Name of the user, required',
              },
              email: {
                bsonType: 'string',
                pattern: '^\\S+@\\S+\\.\\S+$',
                description: "User's email address, required and must match the email format",
              },
              password: {
                bsonType: 'string',
                description: 'Hashed password of the user, required',
              },
              emailVerifyToken: {
                bsonType: ['string', 'null'],
                description: 'Token for email verification, can be null',
              },
              resetPasswordToken: {
                bsonType: ['string', 'null'],
                description: 'Token for password reset, can be null',
              },
              avatar: {
                bsonType: ['string', 'null'],
                description: 'Avatar URL for the user, can be null',
              },
              createdAt: {
                bsonType: 'date',
                description: 'Date when the user was created, required',
              },
              updatedAt: {
                bsonType: 'date',
                description: 'Date when the user was last updated, required',
              },
            },
            additionalProperties: false,
          },
        },
      })
    }

    const isIndexExist = await this.users.indexExists('email_1')
    if (!isIndexExist) {
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async setUpRefreshTokensCollection() {
    const isExistCollection = await this.db.listCollections({ name: 'refreshTokens' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('refreshTokens', {
        validator: {
          $jsonSchema: {
            title: 'Refresh Token Schema',
            bsonType: 'object',
            required: ['token', 'userId', 'iat', 'exp', 'createdAt'],
            properties: {
              _id: {
                bsonType: 'objectId',
                description: 'Unique identifier for the refresh token',
              },
              token: {
                bsonType: 'string',
                description: 'The refresh token string, required',
              },
              userId: {
                bsonType: 'objectId',
                description: 'The user associated with the refresh token, required',
              },
              iat: {
                bsonType: 'date',
                description: 'Issued at time, required',
              },
              exp: {
                bsonType: 'date',
                description: 'Expiration time, required',
              },
              createdAt: {
                bsonType: 'date',
                description: 'The date when the refresh token was created, required',
              },
            },
            additionalProperties: false,
          },
        },
      })
    }

    const isIndexExist = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (!isIndexExist) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async setUpFavoritesCollection() {
    const isExistCollection = await this.db.listCollections({ name: 'favorites' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('favorites', {
        validator: {
          $jsonSchema: {
            title: 'Favorites Schema',
            bsonType: 'object',
            required: ['userId', 'mediaId', 'mediaTitle', 'mediaType', 'mediaReleaseDate', 'createdAt'],
            properties: {
              _id: {
                bsonType: 'objectId',
                description: 'Unique identifier for the favorite item',
              },
              userId: {
                bsonType: 'objectId',
                description: 'The user who favorited the media, required',
              },
              mediaId: {
                bsonType: 'number',
                description: 'The ID of the media item, required',
              },
              mediaTitle: {
                bsonType: 'string',
                description: 'Title of the media item, required',
              },
              mediaType: {
                bsonType: 'string',
                enum: ['movie', 'tv'],
                description: "Type of the media, required (either 'movie' or 'tv')",
              },
              mediaPoster: {
                bsonType: ['string', 'null'],
                description: 'Path to the poster image, can be null',
              },
              mediaReleaseDate: {
                bsonType: 'string',
                description: 'Release date of the media item in string format, required',
              },
              createdAt: {
                bsonType: 'date',
                description: 'The date when the favorite item was created, required',
              },
            },
            additionalProperties: false,
          },
        },
      })
    }

    const isIndexExist = await this.favorites.indexExists(['userId_1_mediaId_1_mediaType_1', 'userId_1'])
    if (!isIndexExist) {
      this.favorites.createIndex({ userId: 1, mediaId: 1, mediaType: 1 })
      this.favorites.createIndex({ userId: 1 })
    }
  }

  async setUpCommentsCollection() {
    const isExistCollection = await this.db.listCollections({ name: 'comments' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('comments', {
        validator: {
          $jsonSchema: {
            title: 'Comments Schema',
            bsonType: 'object',
            required: ['userId', 'mediaId', 'mediaTitle', 'mediaType', 'content', 'createdAt', 'updatedAt'],
            properties: {
              _id: {
                bsonType: 'objectId',
                description: 'Unique identifier for the comment',
              },
              userId: {
                bsonType: 'objectId',
                description: 'The user who made the comment, required',
              },
              mediaId: {
                bsonType: 'number',
                description: 'The ID of the media item, required',
              },
              mediaTitle: {
                bsonType: 'string',
                description: 'Title of the media item, required',
              },
              mediaType: {
                bsonType: 'string',
                enum: ['movie', 'tv'],
                description: "Type of the media (either 'movie' or 'tv'), required",
              },
              mediaPoster: {
                bsonType: ['string', 'null'],
                description: 'Path to the media poster image, can be null',
              },
              mediaReleaseDate: {
                bsonType: 'string',
                description: 'Release date of the media item in string format, required',
              },
              content: {
                bsonType: 'string',
                description: 'Content of the comment, required',
              },
              createdAt: {
                bsonType: 'date',
                description: 'The date when the comment was created, required',
              },
              updatedAt: {
                bsonType: 'date',
                description: 'The date when the comment was last updated, required',
              },
            },
            additionalProperties: false,
          },
        },
      })
    }

    const isIndexExist = await this.comments.indexExists(['mediaId_1_mediaType_1', 'userId_1', '_id_1_userId_1'])
    if (!isIndexExist) {
      this.comments.createIndex({ mediaId: 1, mediaType: 1 })
      this.comments.createIndex({ userId: 1 })
      this.comments.createIndex({ _id: 1, userId: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection<User>('users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refreshTokens')
  }

  get favorites(): Collection<Favorite> {
    return this.db.collection('favorites')
  }

  get comments(): Collection<Comment> {
    return this.db.collection('comments')
  }
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService

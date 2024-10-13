import { Collection, Db, MongoClient } from 'mongodb'

import envVariables from '@/schemas/env-variables.schema'
import User from '@/models/user.model'
import Comment from '@/models/comment.model'
import Favorite from '@/models/favorite.model'
import RefreshToken from '@/models/refresh-token.model'

const uri = `mongodb+srv://${envVariables.DB_USERNAME}:${envVariables.DB_PASSWORD}@movie-app-singapore.s0ve5.mongodb.net/?retryWrites=true&w=majority&appName=${envVariables.DB_CLUSTER}`

class DatabaseService {
  private client: MongoClient
  private db: Db

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

  async indexUsers() {
    const isExistCollection = await this.db.listCollections({ name: 'users' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('users')
    }

    const isIndexExist = await this.users.indexExists('email_1')
    if (!isIndexExist) {
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const isExistCollection = await this.db.listCollections({ name: 'refreshTokens' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('refreshTokens')
    }

    const isIndexExist = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (!isIndexExist) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexFavorites() {
    const isExistCollection = await this.db.listCollections({ name: 'favorites' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('favorites')
    }

    const isIndexExist = await this.favorites.indexExists(['userId_1_mediaId_1_mediaType_1', 'userId_1'])
    if (!isIndexExist) {
      this.favorites.createIndex({ userId: 1, mediaId: 1, mediaType: 1 })
      this.favorites.createIndex({ userId: 1 })
    }
  }

  async indexComments() {
    const isExistCollection = await this.db.listCollections({ name: 'comments' }).hasNext()
    if (!isExistCollection) {
      this.db.createCollection('comments')
    }

    const isIndexExist = await this.comments.indexExists(['mediaId_1_mediaType_1', 'userId_1'])
    if (!isIndexExist) {
      this.comments.createIndex({ mediaId: 1, mediaType: 1 })
      this.comments.createIndex({ userId: 1 })
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

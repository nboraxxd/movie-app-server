import { Collection, Db, MongoClient } from 'mongodb'

import User from '@/models/user.model'
import Favorite from '@/models/favorite.model'
import RefreshToken from '@/models/refresh-token.model'
import envVariables from '@/schemas/env-variables.schema'

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
    const isExist = await this.users.indexExists('email_1')
    if (isExist) return

    this.users.createIndex({ email: 1 }, { unique: true })
  }

  async indexRefreshTokens() {
    const isExist = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (isExist) return

    this.refreshTokens.createIndex({ token: 1 })
    this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
  }

  async indexFavorites() {
    const isExist = await this.favorites.indexExists(['userId_1_mediaId_1_type_1', 'userId_1'])
    if (isExist) return

    this.favorites.createIndex({ userId: 1, mediaId: 1, type: 1 })
    this.favorites.createIndex({ userId: 1 })
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
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService

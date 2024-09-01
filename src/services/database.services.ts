import { Db, MongoClient } from 'mongodb'

import User from '@/models/user.model'
import { envVariables } from '@/constants/env-variables'

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

  get users() {
    return this.db.collection<User>('users')
  }
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService

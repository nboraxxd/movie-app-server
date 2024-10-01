import { FavoriteBodyType } from '@/schemas/favorite.schema'
import databaseService from '@/services/database.services'

class FavoritesService {
  async addFavorite(payload: FavoriteBodyType & { userId: string }) {
    const { userId, ...favorite } = payload

    return databaseService.favorites.insertOne({ userId, ...favorite })
  }
}

const favoritesService = new FavoritesService()
export default favoritesService

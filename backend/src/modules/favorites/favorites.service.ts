import { Injectable } from "@nestjs/common";
import {
  addFavoriteForUser,
  listFavoritesForUser,
  removeFavoriteForUser,
} from "./favorites.repository";

@Injectable()
export class FavoritesService {
  list(userId: string) {
    return listFavoritesForUser(userId);
  }

  add(userId: string, productId: string) {
    return addFavoriteForUser(userId, productId);
  }

  remove(userId: string, productId: string) {
    return removeFavoriteForUser(userId, productId);
  }
}

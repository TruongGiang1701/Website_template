import { Injectable } from "@nestjs/common";
import {
  getGuestCart,
  getUserCart,
  mergeGuestCartIntoUser,
  removeGuestCartItem,
  removeUserCartItem,
  upsertGuestCartItem,
  upsertUserCartItem,
} from "./cart.repository";

@Injectable()
export class CartService {
  getGuest(sessionId: string) {
    return getGuestCart(sessionId);
  }

  getUser(userId: string) {
    return getUserCart(userId);
  }

  upsertGuestItem(sessionId: string, productId: string, qty: number) {
    return upsertGuestCartItem(sessionId, productId, qty);
  }

  upsertUserItem(userId: string, productId: string, qty: number) {
    return upsertUserCartItem(userId, productId, qty);
  }

  removeGuestItem(sessionId: string, productId: string) {
    return removeGuestCartItem(sessionId, productId);
  }

  removeUserItem(userId: string, productId: string) {
    return removeUserCartItem(userId, productId);
  }

  mergeGuestIntoUser(sessionId: string, userId: string) {
    return mergeGuestCartIntoUser(sessionId, userId);
  }
}

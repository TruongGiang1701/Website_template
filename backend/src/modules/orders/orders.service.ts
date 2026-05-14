import { Injectable } from "@nestjs/common";
import {
  createOrderFromCurrentCart,
  getOrderByCodeForUser,
  listOrdersByUser,
  type CreateOrderInput,
} from "./orders.repository";

@Injectable()
export class OrdersService {
  create(userId: string, input: CreateOrderInput) {
    return createOrderFromCurrentCart(userId, input);
  }

  list(userId: string) {
    return listOrdersByUser(userId);
  }

  detailByCode(userId: string, code: string) {
    return getOrderByCodeForUser(userId, code);
  }
}

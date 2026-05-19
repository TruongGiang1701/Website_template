"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("./cart.repository");
let CartService = class CartService {
    getGuest(sessionId) {
        return (0, cart_repository_1.getGuestCart)(sessionId);
    }
    getUser(userId) {
        return (0, cart_repository_1.getUserCart)(userId);
    }
    upsertGuestItem(sessionId, productId, qty) {
        return (0, cart_repository_1.upsertGuestCartItem)(sessionId, productId, qty);
    }
    upsertUserItem(userId, productId, qty) {
        return (0, cart_repository_1.upsertUserCartItem)(userId, productId, qty);
    }
    removeGuestItem(sessionId, productId) {
        return (0, cart_repository_1.removeGuestCartItem)(sessionId, productId);
    }
    removeUserItem(userId, productId) {
        return (0, cart_repository_1.removeUserCartItem)(userId, productId);
    }
    mergeGuestIntoUser(sessionId, userId) {
        return (0, cart_repository_1.mergeGuestCartIntoUser)(sessionId, userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);

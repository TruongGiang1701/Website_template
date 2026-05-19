"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartMutationError = void 0;
class CartMutationError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "CartMutationError";
    }
}
exports.CartMutationError = CartMutationError;

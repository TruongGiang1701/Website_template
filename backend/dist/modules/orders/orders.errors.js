"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersMutationError = void 0;
class OrdersMutationError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "OrdersMutationError";
    }
}
exports.OrdersMutationError = OrdersMutationError;

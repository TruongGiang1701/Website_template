"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesMutationError = void 0;
class FavoritesMutationError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "FavoritesMutationError";
    }
}
exports.FavoritesMutationError = FavoritesMutationError;

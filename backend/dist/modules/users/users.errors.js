"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMutationError = void 0;
class UsersMutationError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "UsersMutationError";
    }
}
exports.UsersMutationError = UsersMutationError;

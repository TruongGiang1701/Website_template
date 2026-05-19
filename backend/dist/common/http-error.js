"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = apiError;
exports.asPlainObject = asPlainObject;
const common_1 = require("@nestjs/common");
function apiError(message, status = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
    return new common_1.HttpException({ ok: false, error: message }, status);
}
function asPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw apiError("Payload phải là object JSON", common_1.HttpStatus.BAD_REQUEST);
    }
    return value;
}

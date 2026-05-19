"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../../lib/db");
const http_error_1 = require("../../common/http-error");
let HealthController = class HealthController {
    async db() {
        try {
            const result = await (0, db_1.query)("select now()::text as now, current_database()::text as current_database");
            const row = result.rows[0];
            return {
                ok: true,
                db: {
                    now: row?.now ?? null,
                    name: row?.current_database ?? null,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message);
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)("db"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "db", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)("health")
], HealthController);

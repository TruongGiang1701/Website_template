"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbPool = getDbPool;
exports.query = query;
const pg_1 = require("pg");
const env_1 = require("../lib/env");
function createPool() {
    return new pg_1.Pool({
        connectionString: (0, env_1.getDatabaseUrl)(),
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
    });
}
function getDbPool() {
    if (!global.__visstemp_pg_pool__) {
        global.__visstemp_pg_pool__ = createPool();
    }
    return global.__visstemp_pg_pool__;
}
async function query(text, values = []) {
    return getDbPool().query(text, values);
}

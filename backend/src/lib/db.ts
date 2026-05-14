import { Pool, type QueryResult, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __visstemp_pg_pool__: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export function getDbPool() {
  if (!global.__visstemp_pg_pool__) {
    global.__visstemp_pg_pool__ = createPool();
  }
  return global.__visstemp_pg_pool__;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  return getDbPool().query<T>(text, values);
}


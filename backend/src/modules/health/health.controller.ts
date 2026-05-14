import { Controller, Get } from "@nestjs/common";
import { query } from "@/lib/db";
import { apiError } from "@/common/http-error";

type HealthDbRow = {
  now: string;
  current_database: string;
};

@Controller("health")
export class HealthController {
  @Get("db")
  async db() {
    try {
      const result = await query<HealthDbRow>(
        "select now()::text as now, current_database()::text as current_database",
      );
      const row = result.rows[0];
      return {
        ok: true,
        db: {
          now: row?.now ?? null,
          name: row?.current_database ?? null,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}

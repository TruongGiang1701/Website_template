import { query } from "@/lib/db";

export type AuditLogDbRow = {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export type AuditLogListItem = {
  id: string;
  created_at: string;
  actor_user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
};

export async function countAuditLogs(): Promise<number> {
  const res = await query<{ cnt: string }>(`SELECT COUNT(*)::text AS cnt FROM audit_logs`);
  return Number.parseInt(res.rows[0]?.cnt ?? "0", 10) || 0;
}

export async function listAuditLogs(
  limit: number,
  offset: number,
): Promise<AuditLogListItem[]> {
  const res = await query<AuditLogDbRow>(
    `
      SELECT
        id,
        actor_user_id,
        action,
        entity_type,
        entity_id,
        meta,
        created_at::text
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );

  return res.rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    actor_user_id: r.actor_user_id,
    action: r.action,
    entity: r.entity_type,
    entity_id: r.entity_id,
    metadata: r.meta,
  }));
}

import { getDbPool, query } from "@/lib/db";
import type {
  UserAuthDTO,
  UserProfileDTO,
  UserSettingsDTO,
} from "@/types/users";
import { UsersMutationError } from "./users.errors";

type UserProfileRow = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  avatar_url: string | null;
  is_disabled: boolean;
  display_name: string;
  preferred_category: string;
  notify_promotions: boolean;
  notify_order_updates: boolean;
  show_profile_public: boolean;
};

function rowToProfile(row: UserProfileRow): UserProfileDTO {
  const settings: UserSettingsDTO = {
    display_name: row.display_name,
    preferred_category: row.preferred_category,
    notify_promotions: row.notify_promotions,
    notify_order_updates: row.notify_order_updates,
    show_profile_public: row.show_profile_public,
  };

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    avatar_url: row.avatar_url,
    is_disabled: row.is_disabled,
    settings,
  };
}

export async function getUserAuthByEmail(
  email: string,
): Promise<UserAuthDTO | null> {
  const e = email.trim();
  if (!e) return null;
  const res = await query<UserAuthDTO>(
    `
      SELECT
        u.id,
        u.email::text,
        u.name,
        u.role::text,
        u.avatar_url,
        u.is_disabled,
        u.password_hash
      FROM users u
      WHERE u.email = $1
      LIMIT 1
    `,
    [e],
  );
  return res.rows[0] ?? null;
}

export async function getUserProfileById(
  userId: string,
): Promise<UserProfileDTO | null> {
  const id = userId.trim();
  if (!id) return null;
  const res = await query<UserProfileRow>(
    `
      SELECT
        u.id,
        u.email::text,
        u.name,
        u.role::text,
        u.avatar_url,
        u.is_disabled,
        COALESCE(us.display_name, u.name) AS display_name,
        COALESCE(us.preferred_category, 'Doanh nghiệp') AS preferred_category,
        COALESCE(us.notify_promotions, true) AS notify_promotions,
        COALESCE(us.notify_order_updates, true) AS notify_order_updates,
        COALESCE(us.show_profile_public, false) AS show_profile_public
      FROM users u
      LEFT JOIN user_settings us ON us.user_id = u.id
      WHERE u.id = $1::uuid
      LIMIT 1
    `,
    [id],
  );
  const row = res.rows[0];
  return row ? rowToProfile(row) : null;
}

export async function createUserWithSettings(input: {
  email: string;
  name: string;
  password_hash: string;
}): Promise<UserProfileDTO> {
  const pool = getDbPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let userId = "";
    try {
      const inserted = await client.query<{ id: string }>(
        `
          INSERT INTO users (email, name, password_hash, role, is_disabled, avatar_url)
          VALUES ($1, $2, $3, 'customer', false, NULL)
          RETURNING id
        `,
        [input.email.trim(), input.name.trim(), input.password_hash],
      );
      userId = inserted.rows[0]?.id ?? "";
    } catch (e: unknown) {
      const code =
        typeof e === "object" && e && "code" in e
          ? String((e as { code: unknown }).code)
          : "";
      if (code === "23505") {
        throw new UsersMutationError("Email đã tồn tại.", 409);
      }
      throw e;
    }

    if (!userId) throw new UsersMutationError("Không tạo được tài khoản.", 500);

    await client.query(
      `
        INSERT INTO user_settings (
          user_id, display_name, preferred_category,
          notify_promotions, notify_order_updates, show_profile_public
        ) VALUES ($1::uuid, $2, 'Doanh nghiệp', true, true, false)
      `,
      [userId, input.name.trim()],
    );

    await client.query("COMMIT");
    const profile = await getUserProfileById(userId);
    if (!profile)
      throw new UsersMutationError(
        "Đã tạo nhưng không đọc lại được user.",
        500,
      );
    return profile;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

export async function updateUserSettingsByUserId(
  userId: string,
  patch: Record<string, unknown>,
): Promise<UserProfileDTO> {
  const profile = await getUserProfileById(userId);
  if (!profile) throw new UsersMutationError("Không tìm thấy người dùng.", 404);

  const next: UserSettingsDTO = {
    display_name:
      typeof patch.display_name === "string"
        ? patch.display_name.trim() || profile.settings.display_name
        : profile.settings.display_name,
    preferred_category:
      typeof patch.preferred_category === "string"
        ? patch.preferred_category.trim() || profile.settings.preferred_category
        : profile.settings.preferred_category,
    notify_promotions:
      typeof patch.notify_promotions === "boolean"
        ? patch.notify_promotions
        : profile.settings.notify_promotions,
    notify_order_updates:
      typeof patch.notify_order_updates === "boolean"
        ? patch.notify_order_updates
        : profile.settings.notify_order_updates,
    show_profile_public:
      typeof patch.show_profile_public === "boolean"
        ? patch.show_profile_public
        : profile.settings.show_profile_public,
  };

  await query(
    `
      INSERT INTO user_settings (
        user_id, display_name, preferred_category,
        notify_promotions, notify_order_updates, show_profile_public
      )
      VALUES ($1::uuid, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        preferred_category = EXCLUDED.preferred_category,
        notify_promotions = EXCLUDED.notify_promotions,
        notify_order_updates = EXCLUDED.notify_order_updates,
        show_profile_public = EXCLUDED.show_profile_public,
        updated_at = now()
    `,
    [
      userId,
      next.display_name,
      next.preferred_category,
      next.notify_promotions,
      next.notify_order_updates,
      next.show_profile_public,
    ],
  );

  const refreshed = await getUserProfileById(userId);
  if (!refreshed)
    throw new UsersMutationError(
      "Đã cập nhật nhưng không đọc lại được user.",
      500,
    );
  return refreshed;
}

export type AdminUserListQuery = {
  page: number;
  pageSize: number;
  q?: string | null;
};

export async function listUsersForAdmin(input: AdminUserListQuery): Promise<{
  items: AdminUserListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const page = Math.max(1, input.page);
  const pageSize = Math.min(100, Math.max(1, input.pageSize));
  const offset = (page - 1) * pageSize;
  const q = input.q?.trim() || null;

  const whereSql = q
    ? `WHERE (lower(u.email) LIKE lower($1) OR lower(u.name) LIKE lower($1))`
    : "";
  const params = q ? [`%${q}%`] : [];

  const countRes = await query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM users u ${whereSql}`,
    params,
  );
  const total = Number.parseInt(countRes.rows[0]?.total || "0", 10);

  const listParams = q ? [...params, pageSize, offset] : [pageSize, offset];
  const listRes = await query<AdminUserListItemDTO>(
    `
      SELECT id, email::text, name, role::text, is_disabled
      FROM users u
      ${whereSql}
      ORDER BY u.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
    listParams,
  );

  return {
    items: listRes.rows,
    total,
    page,
    pageSize,
  };
}

export async function getUserDetailForAdmin(
  userId: string,
): Promise<AdminUserDetailDTO | null> {
  const res = await query<AdminUserDetailDTO>(
    `
      SELECT
        u.id,
        u.email::text,
        u.name,
        u.role::text,
        u.is_disabled,
        COALESCE(o.order_count, 0)::integer AS order_count,
        COALESCE(o.total_spent, 0)::bigint AS total_spent_vnd
      FROM users u
      LEFT JOIN (
        SELECT
          user_id,
          COUNT(*) AS order_count,
          SUM(total_vnd) AS total_spent
        FROM orders
        WHERE status != 'cancelled'
        GROUP BY user_id
      ) o ON o.user_id = u.id
      WHERE u.id = $1::uuid
      LIMIT 1
    `,
    [userId],
  );
  return res.rows[0] ?? null;
}

export async function toggleUserDisabledStatus(
  userId: string,
  isDisabled: boolean,
): Promise<AdminUserDetailDTO> {
  await query(
    `UPDATE users SET is_disabled = $2, updated_at = now() WHERE id = $1::uuid`,
    [userId, isDisabled],
  );
  const updated = await getUserDetailForAdmin(userId);
  if (!updated) throw new UsersMutationError("Không tìm thấy người dùng.", 404);
  return updated;
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<AdminUserDetailDTO> {
  if (role !== "admin" && role !== "staff" && role !== "customer") {
    throw new UsersMutationError("Vai trò không hợp lệ.", 400);
  }
  await query(
    `UPDATE users SET role = $2::user_role, updated_at = now() WHERE id = $1::uuid`,
    [userId, role],
  );
  const updated = await getUserDetailForAdmin(userId);
  if (!updated) throw new UsersMutationError("Không tìm thấy người dùng.", 404);
  return updated;
}


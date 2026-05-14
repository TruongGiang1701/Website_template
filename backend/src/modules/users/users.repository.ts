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


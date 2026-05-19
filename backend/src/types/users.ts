export type UserSettingsDTO = {
  display_name: string;
  preferred_category: string;
  notify_promotions: boolean;
  notify_order_updates: boolean;
  show_profile_public: boolean;
};

export type UserProfileDTO = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  avatar_url: string | null;
  is_disabled: boolean;
  settings: UserSettingsDTO;
};

export type UserAuthDTO = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  avatar_url: string | null;
  is_disabled: boolean;
  password_hash: string;
};

export type AdminUserListItemDTO = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  is_disabled: boolean;
};

export type AdminUserDetailDTO = AdminUserListItemDTO & {
  order_count: number;
  total_spent_vnd: number;
};

export type AdminDashboardMetrics = {
  total_revenue_vnd: number;
  new_orders_this_month: number;
  new_users_this_month: number;
  top_products: {
    product_id: string;
    title: string;
    units_sold: number;
    revenue_vnd: number;
  }[];
  /** Tuỳ chọn — khi backend có series 7 ngày. */
  revenue_last_7_days?: { date: string; amount_vnd: number }[];
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "customer";
  is_disabled: boolean;
  created_at?: string;
};

export type AdminUserListPayload = {
  items: AdminUserListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminUserDetail = AdminUserListItem & {
  avatar_url?: string | null;
  order_count?: number;
  total_spent_vnd?: number;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  title: string;
  status: string;
  deleted_at?: string | null;
  price_vnd?: number;
  group?: string | null;
};

export type AdminProductListPayload = {
  items: AdminProductListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminAuditLogRow = {
  id: string;
  created_at: string;
  actor_user_id?: string | null;
  action?: string;
  entity?: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type AdminAuditLogPayload = {
  items: AdminAuditLogRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminCategoryListItem = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  product_count: number;
};

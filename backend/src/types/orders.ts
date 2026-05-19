export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export type OrderListItemDTO = {
  id: string;
  code: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal_vnd: number;
  discount_vnd: number;
  total_vnd: number;
  contact_name: string | null;
  contact_email: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  item_count: number;
  total_qty: number;
};

export type OrderItemDTO = {
  product_uuid: string;
  product_id: string;
  product_slug: string;
  title_snapshot: string;
  price_snapshot_vnd: number;
  qty: number;
  line_total_vnd: number;
};

export type OrderEventDTO = {
  id: string;
  actor_user_id: string | null;
  source: "system" | "admin" | "webhook" | "customer";
  event_type: string;
  prev_status: string | null;
  next_status: string | null;
  prev_payment_status: string | null;
  next_payment_status: string | null;
  note: string | null;
  created_at: string;
};

export type OrderDetailDTO = Omit<OrderListItemDTO, "item_count" | "total_qty"> & {
  items: OrderItemDTO[];
  events: OrderEventDTO[];
  /** Chỉ có khi gọi API admin chi tiết đơn (join users). */
  user_id?: string | null;
  user_account_email?: string | null;
  user_account_name?: string | null;
  admin_notes?: string | null;
};

/** Danh sách đơn cho admin (kèm email tài khoản khách nếu có). */
export type AdminOrderListItemDTO = OrderListItemDTO & {
  user_id: string | null;
  user_account_email: string | null;
};

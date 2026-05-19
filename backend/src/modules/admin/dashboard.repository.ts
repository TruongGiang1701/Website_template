import { query } from "@/lib/db";

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
  revenue_last_7_days: {
    date: string;
    amount_vnd: number;
  }[];
};

export async function getDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [totalRevRes, newOrdersRes, newUsersRes, topProductsRes, revenueLast7DaysRes] = await Promise.all([
    query<{ total: string }>(`SELECT SUM(total_vnd)::text AS total FROM orders WHERE payment_status = 'paid'`),
    query<{ cnt: string }>(`SELECT COUNT(*)::text AS cnt FROM orders WHERE date_trunc('month', created_at) = date_trunc('month', now())`),
    query<{ cnt: string }>(`SELECT COUNT(*)::text AS cnt FROM users WHERE date_trunc('month', created_at) = date_trunc('month', now())`),
    query<{ product_id: string; title: string; units_sold: string; revenue_vnd: string }>(`
      SELECT
        oi.product_id::text,
        MAX(oi.title_snapshot) AS title,
        SUM(oi.qty)::text AS units_sold,
        SUM(oi.price_snapshot_vnd * oi.qty)::text AS revenue_vnd
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY oi.product_id
      ORDER BY SUM(oi.qty) DESC
      LIMIT 5
    `),
    query<{ date: string; amount_vnd: string }>(`
      SELECT
        to_char(d, 'YYYY-MM-DD') AS date,
        COALESCE(SUM(o.total_vnd), 0)::text AS amount_vnd
      FROM generate_series(current_date - interval '6 days', current_date, '1 day'::interval) d
      LEFT JOIN orders o ON to_char(o.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD') = to_char(d, 'YYYY-MM-DD') AND o.payment_status = 'paid'
      GROUP BY d
      ORDER BY d ASC
    `)
  ]);

  const total_revenue_vnd = Number.parseInt(totalRevRes.rows[0]?.total || "0", 10);
  const new_orders_this_month = Number.parseInt(newOrdersRes.rows[0]?.cnt || "0", 10);
  const new_users_this_month = Number.parseInt(newUsersRes.rows[0]?.cnt || "0", 10);
  
  const top_products = topProductsRes.rows.map((r) => ({
    product_id: r.product_id,
    title: r.title,
    units_sold: Number.parseInt(r.units_sold || "0", 10),
    revenue_vnd: Number.parseInt(r.revenue_vnd || "0", 10),
  }));

  const revenue_last_7_days = revenueLast7DaysRes.rows.map((r) => ({
    date: r.date,
    amount_vnd: Number.parseInt(r.amount_vnd || "0", 10),
  }));

  return {
    total_revenue_vnd,
    new_orders_this_month,
    new_users_this_month,
    top_products,
    revenue_last_7_days,
  };
}

import { getDbPool, query } from "@/lib/db";
import type {
  OrderDetailDTO,
  OrderEventDTO,
  OrderItemDTO,
  OrderListItemDTO,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders";
import { OrdersMutationError } from "./orders.errors";

type OrderSummaryRow = {
  id: string;
  code: string;
  status: string;
  payment_status: string;
  subtotal_vnd: string;
  discount_vnd: string;
  total_vnd: string;
  contact_name: string | null;
  contact_email: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  item_count: string;
  total_qty: string;
};

type OrderBaseRow = Omit<OrderSummaryRow, "item_count" | "total_qty">;

type OrderItemRow = {
  product_uuid: string;
  legacy_key: string | null;
  slug: string;
  title_snapshot: string;
  price_snapshot_vnd: string;
  qty: string;
};

type OrderEventRow = {
  id: string;
  source: "system" | "admin" | "webhook" | "customer";
  event_type: string;
  prev_status: string | null;
  next_status: string | null;
  prev_payment_status: string | null;
  next_payment_status: string | null;
  note: string | null;
  created_at: string;
};

function publicProductId(legacyKey: string | null, slug: string): string {
  const legacy = legacyKey?.trim();
  return legacy && legacy.length > 0 ? legacy : slug;
}

function toOrderStatus(value: string): OrderStatus {
  if (value === "pending" || value === "processing" || value === "completed" || value === "cancelled") {
    return value;
  }
  return "pending";
}

function toPaymentStatus(value: string): PaymentStatus {
  if (value === "unpaid" || value === "paid" || value === "failed" || value === "refunded") {
    return value;
  }
  return "unpaid";
}

function toInt(raw: string | number | null | undefined): number {
  const n = Number.parseInt(String(raw ?? "0"), 10);
  return Number.isFinite(n) ? n : 0;
}

function mapSummary(row: OrderSummaryRow): OrderListItemDTO {
  return {
    id: row.id,
    code: row.code,
    status: toOrderStatus(row.status),
    payment_status: toPaymentStatus(row.payment_status),
    subtotal_vnd: toInt(row.subtotal_vnd),
    discount_vnd: toInt(row.discount_vnd),
    total_vnd: toInt(row.total_vnd),
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    note: row.note,
    created_at: row.created_at,
    updated_at: row.updated_at,
    item_count: toInt(row.item_count),
    total_qty: toInt(row.total_qty),
  };
}

function mapBase(row: OrderBaseRow): Omit<OrderDetailDTO, "items" | "events"> {
  return {
    id: row.id,
    code: row.code,
    status: toOrderStatus(row.status),
    payment_status: toPaymentStatus(row.payment_status),
    subtotal_vnd: toInt(row.subtotal_vnd),
    discount_vnd: toInt(row.discount_vnd),
    total_vnd: toInt(row.total_vnd),
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    note: row.note,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapItem(row: OrderItemRow): OrderItemDTO {
  const qty = toInt(row.qty);
  const price = toInt(row.price_snapshot_vnd);
  return {
    product_uuid: row.product_uuid,
    product_id: publicProductId(row.legacy_key, row.slug),
    product_slug: row.slug,
    title_snapshot: row.title_snapshot,
    price_snapshot_vnd: price,
    qty,
    line_total_vnd: qty * price,
  };
}

function mapEvent(row: OrderEventRow): OrderEventDTO {
  return {
    id: row.id,
    source: row.source,
    event_type: row.event_type,
    prev_status: row.prev_status,
    next_status: row.next_status,
    prev_payment_status: row.prev_payment_status,
    next_payment_status: row.next_payment_status,
    note: row.note,
    created_at: row.created_at,
  };
}

function buildOrderCode(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${y}${m}${day}-${hh}${mm}${ss}-${rand}`;
}

export type CreateOrderInput = {
  contact_name?: string;
  contact_email?: string;
  note?: string;
};

export async function createOrderFromCurrentCart(
  userId: string,
  input: CreateOrderInput,
): Promise<OrderDetailDTO> {
  const uid = userId.trim();
  if (!uid) {
    throw new OrdersMutationError("Thiếu user.", 400);
  }

  const contactName = input.contact_name?.trim() || null;
  const contactEmail = input.contact_email?.trim() || null;
  const note = input.note?.trim() || null;

  const client = await getDbPool().connect();
  try {
    await client.query("BEGIN");

    const cartRes = await client.query<{ id: string }>(
      `
        SELECT c.id
        FROM carts c
        WHERE c.user_id = $1::uuid
        ORDER BY c.updated_at DESC NULLS LAST, c.created_at DESC
        LIMIT 1
        FOR UPDATE
      `,
      [uid],
    );
    const cartId = cartRes.rows[0]?.id;
    if (!cartId) {
      throw new OrdersMutationError("Giỏ hàng đang trống.", 400);
    }

    const rows = await client.query<{ subtotal_vnd: string }>(
      `
        SELECT
          COALESCE(SUM(ci.qty * ci.price_snapshot_vnd), 0)::text AS subtotal_vnd
        FROM cart_items ci
        WHERE ci.cart_id = $1::uuid
      `,
      [cartId],
    );
    const subtotal = toInt(rows.rows[0]?.subtotal_vnd);
    if (subtotal <= 0) {
      throw new OrdersMutationError("Giỏ hàng đang trống.", 400);
    }

    let orderId = "";
    let orderCode = "";
    for (let i = 0; i < 5; i += 1) {
      const code = buildOrderCode();
      try {
        const inserted = await client.query<{ id: string; code: string }>(
          `
            INSERT INTO orders (
              code, user_id, status, payment_status,
              subtotal_vnd, discount_vnd, total_vnd,
              contact_name, contact_email, note
            )
            VALUES (
              $1, $2::uuid, 'pending', 'unpaid',
              $3, 0, $3,
              $4, $5, $6
            )
            RETURNING id, code
          `,
          [code, uid, subtotal, contactName, contactEmail, note],
        );
        orderId = inserted.rows[0]!.id;
        orderCode = inserted.rows[0]!.code;
        break;
      } catch (e: unknown) {
        const code = typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
        if (code !== "23505") throw e;
      }
    }
    if (!orderId || !orderCode) {
      throw new OrdersMutationError("Không tạo được mã đơn hàng, vui lòng thử lại.", 500);
    }

    await client.query(
      `
        INSERT INTO order_items (
          order_id,
          product_id,
          title_snapshot,
          price_snapshot_vnd,
          qty
        )
        SELECT
          $1::uuid,
          ci.product_id,
          p.title,
          ci.price_snapshot_vnd,
          ci.qty
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = $2::uuid
      `,
      [orderId, cartId],
    );

    await client.query(
      `
        INSERT INTO order_events (
          order_id,
          actor_user_id,
          source,
          event_type,
          prev_status,
          next_status,
          prev_payment_status,
          next_payment_status,
          note
        )
        VALUES (
          $1::uuid,
          $2::uuid,
          'customer',
          'order_created',
          NULL,
          'pending',
          NULL,
          'unpaid',
          $3
        )
      `,
      [orderId, uid, note],
    );

    await client.query(`DELETE FROM cart_items WHERE cart_id = $1::uuid`, [cartId]);
    await client.query(`UPDATE carts SET updated_at = now() WHERE id = $1::uuid`, [cartId]);

    await client.query("COMMIT");
    return getOrderByCodeForUser(uid, orderCode);
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    throw e;
  } finally {
    client.release();
  }
}

export async function listOrdersByUser(userId: string): Promise<OrderListItemDTO[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const result = await query<OrderSummaryRow>(
    `
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text,
        COALESCE(oi.item_count, 0)::text AS item_count,
        COALESCE(oi.total_qty, 0)::text AS total_qty
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::integer AS item_count,
          COALESCE(SUM(oi2.qty), 0)::integer AS total_qty
        FROM order_items oi2
        WHERE oi2.order_id = o.id
      ) oi ON TRUE
      WHERE o.user_id = $1::uuid
      ORDER BY o.created_at DESC
    `,
    [uid],
  );

  return result.rows.map(mapSummary);
}

export async function getOrderByCodeForUser(
  userId: string,
  code: string,
): Promise<OrderDetailDTO> {
  const uid = userId.trim();
  const c = code.trim();
  if (!uid || !c) {
    throw new OrdersMutationError("Thiếu thông tin đơn hàng.", 400);
  }

  const base = await query<OrderBaseRow>(
    `
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text
      FROM orders o
      WHERE o.user_id = $1::uuid
        AND o.code = $2
      LIMIT 1
    `,
    [uid, c],
  );
  const row = base.rows[0];
  if (!row) {
    throw new OrdersMutationError("Không tìm thấy đơn hàng.", 404);
  }

  const items = await query<OrderItemRow>(
    `
      SELECT
        p.id::text AS product_uuid,
        p.legacy_key,
        p.slug,
        oi.title_snapshot,
        oi.price_snapshot_vnd::text,
        oi.qty::text
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1::uuid
      ORDER BY oi.title_snapshot ASC
    `,
    [row.id],
  );

  const events = await query<OrderEventRow>(
    `
      SELECT
        oe.id,
        oe.source::text AS source,
        oe.event_type,
        oe.prev_status,
        oe.next_status,
        oe.prev_payment_status,
        oe.next_payment_status,
        oe.note,
        oe.created_at::text
      FROM order_events oe
      WHERE oe.order_id = $1::uuid
      ORDER BY oe.created_at DESC
    `,
    [row.id],
  );

  return {
    ...mapBase(row),
    items: items.rows.map(mapItem),
    events: events.rows.map(mapEvent),
  };
}


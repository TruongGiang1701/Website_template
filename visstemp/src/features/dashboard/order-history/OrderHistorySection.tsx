"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { readSession } from "@/app/(auth)/_components/auth-storage";
import { listOrders } from "@/lib/api/orders";
import { useAuth } from "@/lib/useAuth";
import type { OrderListItemDTO } from "@/types/orders";

function formatVnd(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("vi-VN");
}

export type OrderHistorySectionProps = {
  /** `standalone` — trang /orders; `embedded` — trong Cài đặt / hồ sơ */
  layout?: "standalone" | "embedded";
};

export function OrderHistorySection({ layout = "standalone" }: OrderHistorySectionProps) {
  const auth = useAuth();
  const [orders, setOrders] = useState<OrderListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionKey = auth.user?.email ?? "";

  useEffect(() => {
    const token = readSession()?.accessToken?.trim() ?? "";
    if (!token) {
      setOrders([]);
      setLoading(false);
      setError("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await listOrders(token);
        if (cancelled) return;
        setOrders(data);
        setError(null);
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Không tải được đơn hàng.");
        setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);
  const embedded = layout === "embedded";

  if (!auth.user) {
    return (
      <div className="space-y-2">
        {!embedded ? (
          <>
            <Heading as="h1">Đơn hàng</Heading>
            <Text muted>Vui lòng đăng nhập để xem lịch sử mua hàng.</Text>
          </>
        ) : (
          <p className="text-sm font-semibold text-[#2b5e95]/80">
            Vui lòng đăng nhập để xem lịch sử đơn hàng đã mua.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!embedded ? (
        <div>
          <Heading as="h1">Lịch sử đơn hàng</Heading>
          <Text muted>Theo dõi trạng thái xử lý và chi tiết các đơn bạn đã tạo.</Text>
        </div>
      ) : (
        <div>
          <p className="text-sm font-extrabold text-[#173a66]">Lịch sử đơn hàng đã mua</p>
          <p className="mt-1 text-sm font-semibold text-[#2b5e95]/75">
            Các đơn bạn đã đặt từ giỏ hàng; nhấn chi tiết để xem sản phẩm và dòng thời gian xử lý.
          </p>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#d7e4f6] bg-white p-6 text-sm font-semibold text-[#2b5e95]/80">
          Đang tải đơn hàng...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-800">
          {error}
        </div>
      ) : null}

      {!loading && !error && !hasOrders ? (
        <div className="rounded-2xl border border-dashed border-[#d7e4f6] bg-white p-8 text-sm font-semibold text-[#2b5e95]/80">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : null}

      {!loading && !error && hasOrders ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-[#173a66]">{order.code}</p>
                  <p className="text-xs font-semibold text-[#2b5e95]/75">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-extrabold text-[#0f67be]">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-[#fff3f3] px-3 py-1 text-xs font-extrabold text-[#d62828]">
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm font-semibold text-[#2b5e95]/85 sm:grid-cols-3">
                <p>Sản phẩm: {order.item_count}</p>
                <p>Số lượng: {order.total_qty}</p>
                <p>Tổng tiền: {formatVnd(order.total_vnd)}</p>
              </div>

              <div className="mt-4">
                <AppLink
                  href={`/orders/${encodeURIComponent(order.code)}`}
                  className="inline-flex rounded-full border border-[#0f67be]/25 bg-[#eef6ff] px-4 py-2 text-xs font-extrabold text-[#0f67be] hover:bg-[#e4f0ff]"
                >
                  Xem chi tiết
                </AppLink>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {embedded && hasOrders ? (
        <p className="text-xs font-semibold text-[#2b5e95]/70">
          <AppLink href="/orders" className="text-[#0f67be] underline underline-offset-2 hover:text-[#0c5296]">
            Mở trang Đơn hàng đầy đủ
          </AppLink>
        </p>
      ) : null}
    </div>
  );
}

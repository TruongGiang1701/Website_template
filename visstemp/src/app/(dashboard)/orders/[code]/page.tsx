"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { readSession } from "@/app/(auth)/_components/auth-storage";
import { getOrderByCode } from "@/lib/api/orders";
import { useAuth } from "@/lib/useAuth";
import type { OrderDetailDTO } from "@/types/orders";

function formatVnd(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("vi-VN");
}

export default function OrderDetailPage() {
  const auth = useAuth();
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params?.code ?? "").trim();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("Thiếu mã đơn hàng.");
      setLoading(false);
      return;
    }
    const token = readSession()?.accessToken?.trim() ?? "";
    if (!token) {
      setError("Vui lòng đăng nhập để xem chi tiết đơn hàng.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await getOrderByCode(token, code);
        if (cancelled) return;
        setOrder(data);
        setError(null);
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Không tải được chi tiết đơn hàng.");
        setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!auth.user) {
    return (
      <Container className="max-w-5xl space-y-2">
        <Heading as="h1">Chi tiết đơn hàng</Heading>
        <Text muted>Vui lòng đăng nhập để xem chi tiết đơn hàng.</Text>
      </Container>
    );
  }

  return (
    <Container className="max-w-5xl space-y-6">
      <div className="space-y-2">
        <AppLink href="/orders" className="text-xs font-extrabold text-[#0f67be] hover:underline">
          ← Quay lại danh sách đơn
        </AppLink>
        <Heading as="h1">Chi tiết đơn hàng</Heading>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#d7e4f6] bg-white p-6 text-sm font-semibold text-[#2b5e95]/80">
          Đang tải dữ liệu...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-800">
          {error}
        </div>
      ) : null}

      {!loading && !error && order ? (
        <>
          <div className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-extrabold text-[#173a66]">{order.code}</p>
              <p className="text-xs font-semibold text-[#2b5e95]/75">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-extrabold text-[#0f67be]">
                {order.status}
              </span>
              <span className="rounded-full bg-[#fff3f3] px-3 py-1 text-xs font-extrabold text-[#d62828]">
                {order.payment_status}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-[#2b5e95]/85 sm:grid-cols-3">
              <p>Tạm tính: {formatVnd(order.subtotal_vnd)}</p>
              <p>Giảm giá: {formatVnd(order.discount_vnd)}</p>
              <p>Tổng tiền: {formatVnd(order.total_vnd)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold text-[#173a66]">Sản phẩm</p>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={`${item.product_uuid}-${item.product_slug}`}
                  className="rounded-xl border border-[#e8eef8] p-3"
                >
                  <p className="text-sm font-extrabold text-[#173a66]">{item.title_snapshot}</p>
                  <p className="mt-1 text-xs font-semibold text-[#2b5e95]/75">
                    Mã: {item.product_id} | SL: {item.qty}
                  </p>
                  <p className="mt-1 text-xs font-extrabold text-[#d62828]">
                    {formatVnd(item.line_total_vnd)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold text-[#173a66]">Lịch sử trạng thái</p>
            <div className="mt-4 space-y-3">
              {order.events.map((event) => (
                <div key={event.id} className="rounded-xl border border-[#e8eef8] p-3">
                  <p className="text-sm font-extrabold text-[#173a66]">{event.event_type}</p>
                  <p className="mt-1 text-xs font-semibold text-[#2b5e95]/75">
                    {event.source} • {formatDate(event.created_at)}
                  </p>
                  {event.note ? (
                    <p className="mt-1 text-xs font-semibold text-[#2b5e95]/75">{event.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </Container>
  );
}

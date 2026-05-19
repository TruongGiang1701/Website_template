"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Mail, Package, StickyNote, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { adminApiJson } from "@/lib/admin-api";
import { formatDateTime, formatVnd } from "@/lib/utils";
import type { AdminOrderDetail, OrderEventRow } from "@/types/admin-orders";
import { useRouter } from "next/navigation";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

function statusVariant(s: string): "default" | "success" | "warning" | "destructive" {
  if (s === "completed") return "success";
  if (s === "cancelled") return "destructive";
  if (s === "processing") return "warning";
  return "default";
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return map[s] ?? s;
}

function paymentLabel(s: string): string {
  const map: Record<string, string> = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại",
    refunded: "Hoàn tiền",
  };
  return map[s] ?? s;
}

function sourceLabel(s: string): string {
  const map: Record<string, string> = {
    system: "Hệ thống",
    admin: "Quản trị",
    webhook: "Webhook",
    customer: "Khách hàng",
  };
  return map[s] ?? s;
}

function describeEvent(ev: OrderEventRow): string {
  if (ev.event_type === "order_created") {
    return "Đơn hàng được tạo";
  }
  if (ev.event_type === "order_status_updated") {
    if (ev.prev_status && ev.next_status) {
      return `Trạng thái: ${statusLabel(ev.prev_status)} → ${statusLabel(ev.next_status)}`;
    }
    return "Cập nhật trạng thái đơn hàng";
  }
  return ev.event_type;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotesDraft, setAdminNotesDraft] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminApiJson<AdminOrderDetail>(`/api/admin/orders/${encodeURIComponent(id)}`);
    if (!res.ok) {
      setError(res.error);
      setOrder(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setOrder(res.data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (order) setAdminNotesDraft(order.admin_notes ?? "");
  }, [order]);

  const saveAdminNotes = async () => {
    if (!order) return;
    setNotesSaving(true);
    const res = await adminApiJson<AdminOrderDetail>(`/api/admin/orders/${order.id}/admin-notes`, {
      method: "PATCH",
      body: JSON.stringify({ admin_notes: adminNotesDraft }),
    });
    setNotesSaving(false);
    if (!res.ok) {
      toast(res.error, "error");
      if (res.status === 401) router.replace("/login");
      return;
    }
    setOrder(res.data);
    toast("Đã lưu ghi chú nội bộ.", "success");
  };

  const patchStatus = async (next: OrderStatus) => {
    if (!order) return;
    setActionLoading(true);
    const res = await adminApiJson<AdminOrderDetail>(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    setActionLoading(false);
    if (!res.ok) {
      toast(res.error, "error");
      if (res.status === 401) router.replace("/login");
      return;
    }
    setOrder(res.data);
    toast("Đã cập nhật trạng thái đơn hàng.", "success");
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-destructive">{error ?? "Không tìm thấy đơn hàng."}</p>
        <Link href="/orders">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const status = order.status as OrderStatus;
  const canAct = status !== "completed" && status !== "cancelled";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Quay lại">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{order.code}</h1>
              <Badge variant={statusVariant(order.status)}>{statusLabel(order.status)}</Badge>
              <Badge variant="outline" className="font-normal">
                {paymentLabel(order.payment_status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tạo lúc: {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canAct ? (
            <>
              {status === "pending" ? (
                <Button disabled={actionLoading} onClick={() => void patchStatus("processing")}>
                  Bắt đầu xử lý
                </Button>
              ) : null}
              <Button
                variant="secondary"
                disabled={actionLoading}
                onClick={() => void patchStatus("completed")}
              >
                Đánh dấu hoàn thành
              </Button>
              <Button
                variant="destructive"
                disabled={actionLoading}
                onClick={() => void patchStatus("cancelled")}
              >
                Hủy đơn
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-primary" />
                Sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-3 text-left font-medium">Sản phẩm</th>
                      <th className="pb-3 text-center font-medium">SL</th>
                      <th className="pb-3 text-right font-medium">Đơn giá</th>
                      <th className="pb-3 text-right font-medium">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items.map((line) => (
                      <tr key={`${line.product_uuid}-${line.title_snapshot}`}>
                        <td className="py-3 font-medium">{line.title_snapshot}</td>
                        <td className="py-3 text-center">{line.qty}</td>
                        <td className="py-3 text-right text-muted-foreground">
                          {formatVnd(line.price_snapshot_vnd)}
                        </td>
                        <td className="py-3 text-right font-medium">
                          {formatVnd(line.line_total_vnd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-3 text-right font-medium">
                        Tạm tính:
                      </td>
                      <td className="pt-3 text-right">{formatVnd(order.subtotal_vnd)}</td>
                    </tr>
                    {order.discount_vnd > 0 ? (
                      <tr>
                        <td colSpan={3} className="pt-2 text-right font-medium">
                          Giảm giá:
                        </td>
                        <td className="pt-2 text-right">-{formatVnd(order.discount_vnd)}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <td colSpan={3} className="pt-3 text-right text-lg font-bold">
                        Tổng cộng:
                      </td>
                      <td className="pt-3 text-right text-lg font-bold text-primary">
                        {formatVnd(order.total_vnd)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {order.note ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ghi chú của khách</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{order.note}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Liên hệ & tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.user_account_name || order.user_account_email ? (
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Tài khoản</p>
                  <p className="font-semibold text-foreground">{order.user_account_name ?? "—"}</p>
                  {order.user_account_email ? (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      {order.user_account_email}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-muted-foreground">Không gắn tài khoản (đặt không đăng nhập).</p>
              )}
              <div className="border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Thông tin liên hệ</p>
                <p className="font-medium">{order.contact_name ?? "—"}</p>
                {order.contact_email ? (
                  <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    {order.contact_email}
                  </p>
                ) : (
                  <p className="mt-1 text-muted-foreground">—</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <StickyNote className="h-4 w-4 text-primary" />
                Ghi chú nội bộ
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Chỉ đội vận hành thấy — không hiển thị cho khách hàng.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className="min-h-[120px] w-full resize-y rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="VD: Đã gọi xác nhận — khách yêu cầu giao trước 17h…"
                value={adminNotesDraft}
                onChange={(e) => setAdminNotesDraft(e.target.value)}
              />
              <Button type="button" disabled={notesSaving} onClick={() => void saveAdminNotes()}>
                {notesSaving ? "Đang lưu…" : "Lưu ghi chú"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Lịch sử (order_events)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.events.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có sự kiện.</p>
              ) : (
                <ul className="relative flex flex-col gap-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {order.events.map((ev) => (
                    <li key={ev.id} className="relative pl-8">
                      <span className="absolute left-0 top-1 z-10 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                      <p className="text-sm font-semibold text-foreground">{describeEvent(ev)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(ev.created_at)} · {sourceLabel(ev.source)}
                        {ev.actor_user_id ? ` · actor: ${ev.actor_user_id.slice(0, 8)}…` : ""}
                      </p>
                      {ev.note ? (
                        <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">{ev.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

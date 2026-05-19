"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { adminApiJson } from "@/lib/admin-api";
import { formatDateTime, formatVnd } from "@/lib/utils";
import type { AdminOrderListItem, AdminOrderListPayload } from "@/types/admin-orders";
import { useRouter } from "next/navigation";

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
    unpaid: "Chưa TT",
    paid: "Đã TT",
    failed: "Lỗi TT",
    refunded: "Hoàn tiền",
  };
  return map[s] ?? s;
}

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const PAYMENT_OPTIONS = [
  { value: "", label: "Tất cả thanh toán" },
  { value: "unpaid", label: "Chưa thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thất bại" },
  { value: "refunded", label: "Hoàn tiền" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<AdminOrderListPayload | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (status) params.set("status", status);
    if (payment) params.set("payment_status", payment);
    if (debouncedQ) params.set("q", debouncedQ);

    const res = await adminApiJson<AdminOrderListPayload>(`/api/admin/orders?${params.toString()}`);
    if (!res.ok) {
      setError(res.error);
      setPayload(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setPayload(res.data);
    setLoading(false);
  }, [page, pageSize, status, payment, debouncedQ, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const pageCount = payload ? Math.max(1, Math.ceil(payload.total / payload.pageSize)) : 1;

  const columns: Column<AdminOrderListItem>[] = [
    {
      header: "Mã đơn",
      accessorKey: "code",
      cell: ({ row }) => (
        <Link href={`/orders/${row.id}`} className="font-semibold text-primary hover:underline">
          {row.code}
        </Link>
      ),
    },
    {
      header: "Khách / Email",
      accessorKey: "contact_email",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.contact_name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.user_account_email ?? row.contact_email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ row }) => <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>,
    },
    {
      header: "Thanh toán",
      accessorKey: "payment_status",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {paymentLabel(row.payment_status)}
        </Badge>
      ),
    },
    {
      header: "Tổng tiền",
      accessorKey: "total_vnd",
      className: "text-right tabular-nums font-semibold",
      cell: ({ row }) => formatVnd(row.total_vnd),
    },
    {
      header: "Tạo lúc",
      accessorKey: "created_at",
      className: "text-muted-foreground whitespace-nowrap",
      cell: ({ row }) => formatDateTime(row.created_at),
    },
    {
      header: "",
      accessorKey: "id",
      className: "w-[52px]",
      cell: ({ row }) => (
        <Link href={`/orders/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Chi tiết">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Đơn hàng"
        description="Danh sách toàn hệ thống — lọc theo trạng thái, thanh toán và tìm theo mã / email."
      />

      {error ? (
        <Card className="mb-6 border-amber-200 bg-amber-50/90">
          <CardContent className="py-4 text-sm text-amber-950">
            <p className="font-medium">Không tải được danh sách</p>
            <p className="mt-1 text-amber-900/90">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <DataTable<AdminOrderListItem>
        columns={columns}
        data={payload?.items ?? []}
        isLoading={loading}
        totalCount={payload?.total}
        pageSize={payload?.pageSize ?? pageSize}
        currentPage={payload?.page ?? page}
        pageCount={pageCount}
        onPageChange={(p) => setPage(p)}
        toolbar={
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Tìm kiếm"
                placeholder="Mã đơn, email khách…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
              <Select
                id="filter-status"
                label="Trạng thái đơn"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              />
              <Select
                id="filter-payment"
                label="Thanh toán"
                options={PAYMENT_OPTIONS}
                value={payment}
                onChange={(e) => {
                  setPayment(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

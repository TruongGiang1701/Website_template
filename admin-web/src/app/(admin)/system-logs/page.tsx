"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { adminApiJson } from "@/lib/admin-api";
import { formatDateTime } from "@/lib/utils";
import type { AdminAuditLogPayload, AdminAuditLogRow } from "@/types/admin-api";
import { useRouter } from "next/navigation";

export default function SystemLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<AdminAuditLogPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    const res = await adminApiJson<AdminAuditLogPayload>(`/api/admin/audit-logs?${params.toString()}`);
    if (!res.ok) {
      setError(res.error);
      setPayload(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setPayload(res.data);
    setLoading(false);
  }, [page, pageSize, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const pageCount = payload ? Math.max(1, Math.ceil(payload.total / payload.pageSize)) : 1;

  const columns: Column<AdminAuditLogRow>[] = [
    {
      header: "Thời điểm",
      accessorKey: "created_at",
      className: "whitespace-nowrap text-muted-foreground",
      cell: ({ row }) => formatDateTime(row.created_at),
    },
    {
      header: "Hành động",
      accessorKey: "action",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-foreground">{row.action ?? "—"}</span>
      ),
    },
    {
      header: "Đối tượng",
      accessorKey: "entity",
      cell: ({ row }) => (
        <span className="text-sm">
          {(row.entity ?? "—") + (row.entity_id ? ` · ${row.entity_id.slice(0, 8)}…` : "")}
        </span>
      ),
    },
    {
      header: "Actor",
      accessorKey: "actor_user_id",
      className: "font-mono text-xs text-muted-foreground",
      cell: ({ row }) => row.actor_user_id?.slice(0, 8) ?? "—",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Nhật ký hệ thống"
        description="Audit trail — chỉ đọc, dùng để truy vết thay đổi dữ liệu (theo API audit-logs)."
      />

      {error ? (
        <Card className="mb-6 border-amber-200 bg-amber-50/90">
          <CardContent className="py-4 text-sm text-amber-950">
            <p className="font-medium">Không tải được nhật ký</p>
            <p className="mt-1 text-amber-900/90">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <DataTable<AdminAuditLogRow>
        columns={columns}
        data={payload?.items ?? []}
        isLoading={loading}
        totalCount={payload?.total}
        pageSize={payload?.pageSize ?? pageSize}
        currentPage={payload?.page ?? page}
        pageCount={pageCount}
        onPageChange={(p) => setPage(p)}
        showFilterButton={false}
      />
    </div>
  );
}

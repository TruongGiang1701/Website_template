"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminApiJson } from "@/lib/admin-api";
import type { AdminProductListItem, AdminProductListPayload } from "@/types/admin-api";
import { useRouter } from "next/navigation";

function productStatusVariant(s: string): "default" | "success" | "warning" | "outline" {
  const x = s.toLowerCase();
  if (x === "active") return "success";
  if (x === "draft") return "warning";
  if (x === "archived") return "outline";
  return "default";
}

function statusLabel(s: string): string {
  const m: Record<string, string> = {
    active: "Hoạt động",
    draft: "Nháp",
    archived: "Lưu trữ",
  };
  return m[s.toLowerCase()] ?? s;
}

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<AdminProductListPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    const res = await adminApiJson<AdminProductListPayload>(`/api/admin/products?${params.toString()}`);
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

  const columns: Column<AdminProductListItem>[] = [
    {
      header: "Sản phẩm",
      accessorKey: "title",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant={productStatusVariant(row.status)}>{statusLabel(row.status)}</Badge>
          {row.deleted_at ? (
            <Badge variant="destructive" className="font-normal">
              Đã xóa mềm
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      header: "Nhóm",
      accessorKey: "group",
      className: "text-muted-foreground",
      cell: ({ row }) => row.group ?? "—",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Sản phẩm"
        description="Toàn bộ SKU — gồm nháp, lưu trữ và bản ghi đã xóa mềm (theo API admin)."
        actions={
          <Link href="/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        }
      />

      {error ? (
        <Card className="mb-6 border-amber-200 bg-amber-50/90">
          <CardContent className="py-4 text-sm text-amber-950">
            <p className="font-medium">Không tải được danh sách</p>
            <p className="mt-1 text-amber-900/90">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <DataTable<AdminProductListItem>
        columns={columns}
        data={payload?.items ?? []}
        isLoading={loading}
        totalCount={payload?.total}
        pageSize={payload?.pageSize ?? pageSize}
        currentPage={payload?.page ?? page}
        pageCount={pageCount}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

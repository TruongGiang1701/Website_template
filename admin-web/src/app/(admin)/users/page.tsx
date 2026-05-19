"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { adminApiJson } from "@/lib/admin-api";
import type { AdminUserListItem, AdminUserListPayload } from "@/types/admin-api";
import { useRouter } from "next/navigation";

function roleLabel(r: string): string {
  const map: Record<string, string> = { admin: "Admin", staff: "Nhân viên", customer: "Khách hàng" };
  return map[r] ?? r;
}

function roleVariant(r: string): "default" | "secondary" | "outline" {
  if (r === "admin") return "default";
  if (r === "staff") return "secondary";
  return "outline";
}

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<AdminUserListPayload | null>(null);

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
    if (debouncedQ) params.set("q", debouncedQ);

    const res = await adminApiJson<AdminUserListPayload>(`/api/admin/users?${params.toString()}`);
    if (!res.ok) {
      setError(res.error);
      setPayload(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setPayload(res.data);
    setLoading(false);
  }, [page, pageSize, debouncedQ, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const pageCount = payload ? Math.max(1, Math.ceil(payload.total / payload.pageSize)) : 1;

  const columns: Column<AdminUserListItem>[] = [
    {
      header: "Họ tên",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Vai trò",
      accessorKey: "role",
      cell: ({ row }) => <Badge variant={roleVariant(row.role)}>{roleLabel(row.role)}</Badge>,
    },
    {
      header: "Trạng thái",
      accessorKey: "is_disabled",
      cell: ({ row }) => (
        <Badge variant={row.is_disabled ? "destructive" : "success"}>
          {row.is_disabled ? "Đã khóa" : "Hoạt động"}
        </Badge>
      ),
    },
    {
      header: "",
      accessorKey: "id",
      className: "w-[52px]",
      cell: ({ row }) => (
        <Link href={`/users/${row.id}`}>
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
        title="Người dùng"
        description="Khách hàng và nhân sự — tìm theo tên hoặc email, mở chi tiết để khóa tài khoản hoặc cấp quyền."
      />

      {error ? (
        <Card className="mb-6 border-amber-200 bg-amber-50/90">
          <CardContent className="py-4 text-sm text-amber-950">
            <p className="font-medium">Không tải được danh sách</p>
            <p className="mt-1 text-amber-900/90">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <DataTable<AdminUserListItem>
        columns={columns}
        data={payload?.items ?? []}
        isLoading={loading}
        totalCount={payload?.total}
        pageSize={payload?.pageSize ?? pageSize}
        currentPage={payload?.page ?? page}
        pageCount={pageCount}
        onPageChange={(p) => setPage(p)}
        toolbar={
          <div className="max-w-md">
            <Input
              label="Tìm kiếm"
              placeholder="Email hoặc tên…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        }
      />
    </div>
  );
}

"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { adminApiJson } from "@/lib/admin-api";
import { formatVnd } from "@/lib/utils";
import type { AdminUserDetail } from "@/types/admin-api";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "customer", label: "Khách hàng" },
  { value: "staff", label: "Nhân viên" },
  { value: "admin", label: "Quản trị viên" },
];

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [nextRole, setNextRole] = useState<string>("staff");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminApiJson<AdminUserDetail>(`/api/admin/users/${encodeURIComponent(id)}`);
    if (!res.ok) {
      setError(res.error);
      setUser(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setUser(res.data);
    setNextRole(res.data.role === "customer" ? "staff" : res.data.role);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleDisable = async () => {
    if (!user) return;
    setBusy(true);
    const res = await adminApiJson<AdminUserDetail>(`/api/admin/users/${user.id}/disable`, {
      method: "PATCH",
      body: JSON.stringify({ is_disabled: !user.is_disabled }),
    });
    setBusy(false);
    if (!res.ok) {
      toast(res.error, "error");
      if (res.status === 401) router.replace("/login");
      return;
    }
    setUser(res.data);
    toast(user.is_disabled ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.", "success");
  };

  const applyRole = async () => {
    if (!user) return;
    setBusy(true);
    const res = await adminApiJson<AdminUserDetail>(`/api/admin/users/${user.id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: nextRole }),
    });
    setBusy(false);
    if (!res.ok) {
      toast(res.error, "error");
      if (res.status === 401) router.replace("/login");
      return;
    }
    setUser(res.data);
    setRoleModal(false);
    toast("Đã cập nhật vai trò.", "success");
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-destructive">{error ?? "Không tìm thấy người dùng."}</p>
        <Link href="/users">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/users">
          <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Quay lại">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge
          className="ml-auto capitalize"
          variant={user.role === "admin" ? "default" : user.role === "staff" ? "secondary" : "outline"}
        >
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mua hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Số đơn:</span>{" "}
              <span className="font-semibold">{user.order_count ?? "—"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Tổng chi:</span>{" "}
              <span className="font-semibold text-primary">
                {typeof user.total_spent_vnd === "number" ? formatVnd(user.total_spent_vnd) : "—"}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon className="h-4 w-4 text-primary" />
              Thao tác
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={busy} onClick={() => void toggleDisable()}>
              {user.is_disabled ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => setRoleModal(true)}>
              Đổi vai trò…
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={roleModal}
        onClose={() => setRoleModal(false)}
        title="Cảnh báo phân quyền"
        description="Thay đổi vai trò ảnh hưởng trực tiếp tới quyền truy cập hệ thống."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoleModal(false)}>
              Hủy
            </Button>
            <Button variant="destructive" disabled={busy} onClick={() => void applyRole()}>
              Xác nhận đổi vai trò
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
            <p>
              Chỉ nên nâng quyền khi đã xác minh danh tính. Hạ quyền admin có thể khóa quản trị nếu không còn
              tài khoản dự phòng.
            </p>
          </div>
          <Select
            id="role-select"
            label="Vai trò mới"
            options={ROLE_OPTIONS}
            value={nextRole}
            onChange={(e) => setNextRole(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

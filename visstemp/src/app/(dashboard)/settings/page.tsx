"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  logoutLocalUser,
  readUserSettings,
  updateLocalUserProfile,
  writeUserSettings,
  type UserSettings,
} from "@/app/(auth)/_components/auth-storage";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/useAuth";
import { homeTemplateOption2 } from "@/features/marketing/pages/home/home.data";
import { OrderHistorySection } from "@/features/dashboard/order-history/OrderHistorySection";

const categoryOptions = homeTemplateOption2.allTabs.filter((t) => t !== "Tất cả");

export default function SettingsPage() {
  const router = useRouter();
  const auth = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth.user) return;
    setDisplayName(auth.user.name);
    setSettings(readUserSettings(auth.user.email));
  }, [auth.user]);

  const canRender = useMemo(
    () => Boolean(auth.user && settings),
    [auth.user, settings],
  );

  if (!auth.user) {
    return (
      <Container className="max-w-4xl space-y-2">
        <Heading as="h1">Cài đặt</Heading>
        <Text muted>Vui lòng đăng nhập để chỉnh sửa cài đặt người dùng.</Text>
      </Container>
    );
  }

  if (!canRender || !settings) {
    return (
      <Container className="max-w-4xl space-y-2">
        <Heading as="h1">Cài đặt</Heading>
        <Text muted>Đang tải dữ liệu người dùng...</Text>
      </Container>
    );
  }

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!auth.user) {
      setMessage("Vui lòng đăng nhập lại để cập nhật cài đặt.");
      return;
    }

    const profileResult = updateLocalUserProfile(auth.user.email, {
      name: displayName,
      password: password.trim() ? password : undefined,
    });
    if (!profileResult.ok) {
      setMessage(profileResult.message);
      return;
    }

    writeUserSettings(auth.user.email, {
      ...settings,
      displayName: displayName.trim(),
    });
    setPassword("");
    setMessage("Cài đặt đã được lưu thành công.");
  };

  const onLogout = () => {
    logoutLocalUser();
    router.push("/");
    router.refresh();
  };

  return (
    <Container className="max-w-5xl space-y-6">
      <div>
        <Heading as="h1">Cài đặt</Heading>
        <Text muted>
          Quản lý hồ sơ, tuỳ chọn thông báo và sở thích ngành website bạn quan tâm.
        </Text>
      </div>

      <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" onSubmit={onSave}>
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold text-[#173a66]">Hồ sơ người dùng</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Tên hiển thị">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
                  placeholder="Tên hiển thị"
                />
              </Field>
              <Field label="Email">
                <input
                  value={auth.user.email}
                  disabled
                  className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-[#f7fbff] px-4 text-sm outline-none"
                />
              </Field>
              <Field label="Mật khẩu mới">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
                  placeholder="Để trống nếu không đổi"
                />
              </Field>
            </div>

            <div className="mt-8 border-t border-[#e8eef8] pt-6">
              <OrderHistorySection layout="embedded" />
            </div>
          </section>

          <section className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold text-[#173a66]">Tùy chọn đơn giản</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Ngành website quan tâm">
                <select
                  value={settings.preferredCategory}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, preferredCategory: e.target.value } : prev,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                label="Nhận thông báo khuyến mãi"
                checked={settings.notifyPromotions}
                onChange={(checked) =>
                  setSettings((prev) =>
                    prev ? { ...prev, notifyPromotions: checked } : prev,
                  )
                }
              />
              <ToggleRow
                label="Nhận cập nhật đơn hàng / giỏ hàng"
                checked={settings.notifyOrderUpdates}
                onChange={(checked) =>
                  setSettings((prev) =>
                    prev ? { ...prev, notifyOrderUpdates: checked } : prev,
                  )
                }
              />
              <ToggleRow
                label="Hiển thị hồ sơ công khai"
                checked={settings.showProfilePublic}
                onChange={(checked) =>
                  setSettings((prev) =>
                    prev ? { ...prev, showProfilePublic: checked } : prev,
                  )
                }
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
          <p className="text-sm font-extrabold text-[#173a66]">Tóm tắt tài khoản</p>
          <div className="space-y-3 text-sm font-semibold text-[#2b5e95]/85">
            <p>
              <span className="text-[#173a66]">Tên hiện tại:</span>{" "}
              {displayName || auth.user.name}
            </p>
            <p>
              <span className="text-[#173a66]">Ngành quan tâm:</span>{" "}
              {settings.preferredCategory}
            </p>
            <p>
              <span className="text-[#173a66]">Thông báo ưu đãi:</span>{" "}
              {settings.notifyPromotions ? "Bật" : "Tắt"}
            </p>
          </div>

          {message ? (
            <div className="rounded-xl border border-[#d7e4f6] bg-[#f7fbff] px-4 py-3 text-sm font-semibold text-[#1b3a66]">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0f67be] to-[#d62828] text-sm font-extrabold text-white shadow-sm transition hover:brightness-95"
          >
            Lưu cài đặt
          </button>
        </aside>
      </form>

      <div className="rounded-2xl border border-[#f1d1d1] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-[#173a66]">Phiên đăng nhập</p>
            <p className="mt-1 text-sm font-semibold text-[#2b5e95]/80">
              Bạn có thể đăng xuất để đưa website trở về trạng thái chưa đăng nhập.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#d62828]/20 bg-[#fff5f5] px-6 text-sm font-extrabold text-[#d62828] transition hover:bg-[#ffeaea]"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </Container>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[#17263f]">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-[#e8eef8] px-4 py-3">
      <span className="text-sm font-semibold text-[#173a66]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
          checked ? "bg-[#0f67be]" : "bg-[#d7e4f6]"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

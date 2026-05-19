"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import {
  canRestoreAdminSession,
  isAdminSession,
  loginAdmin,
  readAdminSession,
  refreshAdminSession,
  syncAccessCookie,
  syncRefreshCookie,
} from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function redirectIfLoggedIn() {
      const session = readAdminSession();
      if (session && isAdminSession(session)) {
        syncAccessCookie(session.accessToken);
        syncRefreshCookie(session.refreshToken);
        router.replace("/dashboard");
        return;
      }
      if (canRestoreAdminSession(session)) {
        const ok = await refreshAdminSession();
        if (ok) router.replace("/dashboard");
      }
    }
    void redirectIfLoggedIn();
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const result = await loginAdmin(email, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }
    const from = searchParams.get("from");
    const target =
      from && from.startsWith("/") && !from.startsWith("//") && from !== "/login"
        ? from
        : "/dashboard";
    router.replace(target);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-indigo-700 to-slate-900 p-10 text-white lg:flex">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/70">
            <Sparkles className="h-4 w-4" />
            Admin Console
          </div>
          <h2 className="mt-8 max-w-sm text-3xl font-bold leading-tight">
            Điều hành cửa hàng với giao diện sáng, rõ ràng.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Bảng điều khiển tối ưu cho thao tác hàng ngày: đơn hàng, khách, sản phẩm và nhật ký — đồng bộ API{" "}
            <span className="font-mono text-white/90">/api/admin</span>.
          </p>
        </div>
        <div className="relative z-10 text-xs text-white/50">© {new Date().getFullYear()} · ProServe Admin</div>
        <div className="pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Đăng nhập</p>
              <p className="text-lg font-bold text-foreground">Admin</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Đăng nhập</h1>
            <p className="mt-1 text-sm text-muted-foreground">Chỉ tài khoản có quyền admin được phép vào.</p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <Input
                id="login-email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-input bg-surface pr-14 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

              <Button type="submit" className="h-11 w-full text-base" disabled={submitting} isLoading={submitting}>
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAdminSession, loginAdmin, readAdminSession, syncAccessCookie } from "@/lib/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const session = readAdminSession();
    if (session && isAdminSession(session)) {
      syncAccessCookie(session.accessToken);
      router.replace("/dashboard");
    }
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1419] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2d3a4d] bg-[#1a2332] p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-[#e8eef7]">Đăng nhập Admin</h1>
        <p className="mt-2 text-center text-sm text-[#8b9cb3]">Console quản trị</p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#b8c5d9]">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#2d3a4d] bg-[#0f1419] px-3 text-sm text-[#e8eef7] outline-none ring-[#3b82f6] focus:border-[#3b82f6] focus:ring-2"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#b8c5d9]">Mật khẩu</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#2d3a4d] bg-[#0f1419] px-3 pr-12 text-sm text-[#e8eef7] outline-none ring-[#3b82f6] focus:border-[#3b82f6] focus:ring-2"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-[#8b9cb3] hover:bg-[#243044] hover:text-[#e8eef7]"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-[#3b82f6] text-sm font-semibold text-white transition hover:bg-[#2563eb] disabled:opacity-60"
          >
            {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

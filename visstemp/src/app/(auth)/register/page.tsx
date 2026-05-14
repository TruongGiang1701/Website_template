"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import { AuthShell } from "@/app/(auth)/_components/AuthShell";
import {
  readSession,
  registerWithApi,
} from "@/app/(auth)/_components/auth-storage";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (readSession()) {
      router.replace("/");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    if (password.length < 6) {
      setError("Mật khẩu cần có ít nhất 6 ký tự.");
      setSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Xác nhận mật khẩu chưa khớp.");
      setSubmitting(false);
      return;
    }
    const result = await registerWithApi({ name, email, password });
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell title="Tạo tài khoản">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Họ và tên">
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên"
            className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
            required
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
            required
          />
        </Field>

        <Field label="Mật khẩu">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 pr-12 text-sm outline-none focus:border-[#9bc0e7]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5d79]"
              aria-label="Hiện mật khẩu"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </Field>

        <Field label="Xác nhận mật khẩu">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              className="h-11 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 pr-12 text-sm outline-none focus:border-[#9bc0e7]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5d79]"
              aria-label="Hiện xác nhận mật khẩu"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
        </Field>

        {error ? <p className="text-xs font-semibold text-[#d62828]">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#0f67be] to-[#d62828] text-base font-extrabold text-white shadow-md transition hover:brightness-95"
        >
          {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>

        <p className="text-center text-[11px] text-[#5d6e88]">
          VISSTEMP cam kết không sử dụng thông tin của khách hàng vào mục đích riêng.
        </p>

        <p className="pt-1 text-center text-xs text-[#4b5d79]">
          Đã có tài khoản?{" "}
          <AppLink href="/login" className="font-bold text-[#0f67be]">
            Đăng nhập
          </AppLink>
        </p>
      </form>
    </AuthShell>
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

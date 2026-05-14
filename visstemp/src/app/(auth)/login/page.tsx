"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import { AuthShell } from "@/app/(auth)/_components/AuthShell";
import { loginWithApi, readSession } from "@/app/(auth)/_components/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    const result = await loginWithApi(email, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell title="Đăng nhập">
      <form className="space-y-4" onSubmit={onSubmit}>
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
              autoComplete="current-password"
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

        <AppLink
          href="/register"
          className="inline-block text-xs text-[#4b5d79] hover:text-[#0f67be]"
        >
          Quên mật khẩu?
        </AppLink>

        {error ? <p className="text-xs font-semibold text-[#d62828]">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#0f67be] to-[#d62828] text-base font-extrabold text-white shadow-md transition hover:brightness-95"
        >
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="space-y-2 pt-2 text-center">
          <p className="text-xs text-[#4b5d79]">hoặc</p>
          <p className="text-xs text-[#4b5d79]">Đăng nhập bằng</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full border border-[#d7e2f2] bg-white"
            >
              <span className="text-[14px] text-[#e94235]">G</span>
            </button>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full border border-[#d7e2f2] bg-white"
            >
              <span className="text-[14px] text-[#1877f2]">f</span>
            </button>
          </div>
        </div>

        <p className="pt-2 text-center text-xs text-[#4b5d79]">
          Chưa có tài khoản?{" "}
          <AppLink href="/register" className="font-bold text-[#0f67be]">
            Đăng ký
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

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  canRestoreAdminSession,
  isAdminSession,
  readAdminSession,
  refreshAdminSession,
  scheduleAccessTokenRefresh,
  syncAccessCookie,
  syncRefreshCookie,
  writeAdminSession,
} from "@/lib/auth-storage";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelRefreshSchedule = () => {};

    async function ensureSession() {
      let session = readAdminSession();

      if (session && isAdminSession(session)) {
        syncAccessCookie(session.accessToken);
        syncRefreshCookie(session.refreshToken);
        cancelRefreshSchedule = scheduleAccessTokenRefresh();
        setReady(true);
        return;
      }

      if (canRestoreAdminSession(session)) {
        const ok = await refreshAdminSession();
        if (ok) {
          session = readAdminSession();
          if (session) {
            syncAccessCookie(session.accessToken);
            syncRefreshCookie(session.refreshToken);
          }
          cancelRefreshSchedule = scheduleAccessTokenRefresh();
          setReady(true);
          return;
        }
      }

      writeAdminSession(null);
      router.replace(`/login?from=${encodeURIComponent(pathname || "/dashboard")}`);
    }

    void ensureSession();

    return () => {
      cancelRefreshSchedule();
    };
  }, [router, pathname]);

  if (!ready) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}

function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <p className="text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập…</p>
    </div>
  );
}

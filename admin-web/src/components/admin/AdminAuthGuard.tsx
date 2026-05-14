"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isAdminSession,
  readAdminSession,
  syncAccessCookie,
  writeAdminSession,
} from "@/lib/auth-storage";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readAdminSession();
    if (!session || !isAdminSession(session)) {
      writeAdminSession(null);
      router.replace(`/login?from=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }
    syncAccessCookie(session.accessToken);
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] text-sm text-[#8b9cb3]">
        Đang kiểm tra phiên đăng nhập…
      </div>
    );
  }

  return <>{children}</>;
}

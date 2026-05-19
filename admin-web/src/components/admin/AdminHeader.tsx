"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { LogOut } from "lucide-react";
import { logoutAdmin, readAdminSession } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();
  const session = useMemo(() => readAdminSession(), []);

  const initials =
    session?.user.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "A";

  const avatar = session?.user.avatar_url?.trim();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-end gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-md sm:px-6">
      <div className="mr-auto hidden text-sm text-muted-foreground md:block">
        Xin chào, <span className="font-medium text-foreground">{session?.user.name ?? "Admin"}</span>
      </div>
      <div className="flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={36}
            height={36}
            className="rounded-full border border-border object-cover shadow-sm"
            unoptimized
          />
        ) : (
          <span
            className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-foreground"
            aria-hidden
          >
            {initials}
          </span>
        )}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-foreground">{session?.user.name ?? "Admin"}</p>
          <p className="max-w-[200px] truncate text-xs text-muted-foreground">{session?.user.email}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-border"
        onClick={() => {
          logoutAdmin();
          router.replace("/login");
          router.refresh();
        }}
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </Button>
    </header>
  );
}

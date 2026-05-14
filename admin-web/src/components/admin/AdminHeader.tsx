"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { logoutAdmin, readAdminSession } from "@/lib/auth-storage";

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
    <header className="flex h-14 shrink-0 items-center justify-end gap-4 border-b border-[#2d3a4d] bg-[#1a2332] px-6">
      <div className="flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={36}
            height={36}
            className="rounded-full border border-[#2d3a4d] object-cover"
            unoptimized
          />
        ) : (
          <span
            className="flex size-9 items-center justify-center rounded-full border border-[#2d3a4d] bg-[#243044] text-xs font-bold text-[#e8eef7]"
            aria-hidden
          >
            {initials}
          </span>
        )}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[#e8eef7]">{session?.user.name ?? "Admin"}</p>
          <p className="max-w-[200px] truncate text-xs text-[#8b9cb3]">{session?.user.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          logoutAdmin();
          router.replace("/login");
          router.refresh();
        }}
        className="rounded-lg border border-[#2d3a4d] bg-[#243044] px-3 py-1.5 text-sm font-medium text-[#e8eef7] transition hover:border-[#3b82f6] hover:bg-[#2d3a4d]"
      >
        Đăng xuất
      </button>
    </header>
  );
}

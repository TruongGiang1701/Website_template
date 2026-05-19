"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/users", label: "Người dùng", icon: Users },
  { href: "/products", label: "Sản phẩm", icon: Package },
  { href: "/categories", label: "Danh mục", icon: Layers },
  { href: "/system-logs", label: "Nhật ký", icon: Activity },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-surface shadow-sm">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          A
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Console</p>
          <p className="text-sm font-bold text-foreground">ProServe Admin</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`)) ||
            (item.href === "/dashboard" && pathname === "/dashboard");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5 shrink-0", active ? "text-primary" : "opacity-80")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Giao diện sáng, tối ưu cho làm việc hàng ngày. Kết nối API qua <span className="font-mono text-foreground/80">/api/admin</span>.
        </p>
      </div>
    </aside>
  );
}

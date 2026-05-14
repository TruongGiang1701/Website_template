"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/users", label: "Users" },
  { href: "/system-logs", label: "System Logs" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[#2d3a4d] bg-[#1a2332]">
      <div className="border-b border-[#2d3a4d] px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8b9cb3]">Admin</p>
        <p className="mt-1 text-lg font-bold text-[#e8eef7]">Console</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[#3b82f6]/15 text-[#93c5fd]"
                  : "text-[#b8c5d9] hover:bg-[#243044] hover:text-[#e8eef7]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

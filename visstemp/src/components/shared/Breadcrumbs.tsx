"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";
import {
  getRouteMetaByHref,
  getRouteMetaForPath,
  type RouteMeta,
} from "@/config/routes";

type Breadcrumb = {
  href: string;
  label: string;
  isCurrent: boolean;
};

export type BreadcrumbsProps = {
  className?: string;
  /**
   * Optional override label for the last breadcrumb.
   * Useful for dynamic routes where the URL includes an id/slug.
   */
  currentLabel?: string;
};

function humanizeSegment(segment: string) {
  const s = segment.replace(/-/g, " ").trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildFromConfig(pathname: string): RouteMeta[] | null {
  const current = getRouteMetaForPath(pathname);
  if (!current) return null;

  const chain: RouteMeta[] = [];
  const seen = new Set<string>();
  let node: RouteMeta | undefined = current;

  while (node && !seen.has(node.href)) {
    chain.unshift(node);
    seen.add(node.href);

    if (!node.parent) break;
    node = getRouteMetaByHref(node.parent);
    if (!node) break;
  }

  if (chain.length === 0 || chain[0]?.href !== "/") {
    const home = getRouteMetaByHref("/") ?? { href: "/", label: "Trang chủ" };
    chain.unshift(home);
  }

  return chain;
}

function buildFallback(pathname: string): RouteMeta[] {
  const segs = pathname.split("?")[0]?.split("#")[0]?.split("/") ?? [];
  const segments = segs.filter(Boolean);

  const chain: RouteMeta[] = [{ href: "/", label: "Trang chủ" }];
  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    chain.push({ href: acc, label: humanizeSegment(seg) });
  }
  return chain;
}

export function Breadcrumbs({ className, currentLabel }: BreadcrumbsProps) {
  const pathname = usePathname() || "/";

  const items = useMemo<Breadcrumb[]>(() => {
    const chain = buildFromConfig(pathname) ?? buildFallback(pathname);

    return chain.map((x, idx) => {
      const isCurrent = idx === chain.length - 1;
      const label = isCurrent && currentLabel ? currentLabel : x.label;
      return { href: x.href, label, isCurrent };
    });
  }, [pathname, currentLabel]);

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1b4f86]/80 sm:text-sm">
        {items.map((item, idx) => (
          <li key={`${item.href}-${idx}`} className="inline-flex items-center gap-2">
            {item.isCurrent ? (
              <span className="font-extrabold text-[#0f67be]">{item.label}</span>
            ) : (
              <AppLink
                href={item.href}
                className="transition-colors hover:text-[#0f67be]"
              >
                {item.label}
              </AppLink>
            )}
            {idx < items.length - 1 ? (
              <span aria-hidden="true" className="text-[#1b4f86]/50">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

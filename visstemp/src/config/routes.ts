export type RouteMeta = {
  href: string;
  label: string;
  /**
   * Parent route href used to build breadcrumb chain.
   * Example: { href: "/pricing", parent: "/" }
   */
  parent?: string;
  /**
   * Optional matcher for dynamic routes.
   * Example: { href: "/blog/[slug]", match: /^\\/blog\\/[^\\/]+$/ }
   */
  match?: RegExp;
};

export const routes: RouteMeta[] = [
  { href: "/", label: "Trang chủ" },

  { href: "/templates", label: "Các mẫu Website", parent: "/" },
  {
    href: "/templates/[slug]",
    label: "Chi tiết mẫu",
    parent: "/templates",
    match: /^\/templates\/[^\/]+$/,
  },
  { href: "/favorites", label: "Yêu thích", parent: "/" },
  { href: "/pricing", label: "Gói dịch vụ", parent: "/" },
  { href: "/cart", label: "Giỏ hàng", parent: "/" },
  { href: "/checkout", label: "Thanh toán", parent: "/cart" },
  { href: "/orders", label: "Đơn hàng", parent: "/" },
  {
    href: "/orders/[code]",
    label: "Chi tiết đơn hàng",
    parent: "/orders",
    match: /^\/orders\/[^\/]+$/,
  },

  // Marketing "Tư vấn" page (current project route)
  { href: "/about", label: "Tư vấn miễn phí", parent: "/" },

  // Example nested consulting route (as requested)
  { href: "/dich-vu", label: "Dịch vụ", parent: "/" },
  { href: "/dich-vu/tu-van-mien-phi", label: "Tư vấn miễn phí", parent: "/dich-vu" },

  // Dynamic route example
  {
    href: "/blog/[slug]",
    label: "Bài viết",
    parent: "/",
    match: /^\/blog\/[^\/]+$/,
  },
];

export function getRouteMetaForPath(pathname: string): RouteMeta | undefined {
  const exact = routes.find((r) => r.href === pathname);
  if (exact) return exact;
  return routes.find((r) => r.match?.test(pathname));
}

export function getRouteMetaByHref(href: string): RouteMeta | undefined {
  return routes.find((r) => r.href === href);
}

/**
 * Sitemap / điều hướng theo nhóm — cập nhật khi thêm page trong Figma.
 * Route groups: (marketing) | (docs) | (auth) | (dashboard)
 */

export const site = {
  name: "Visstemp",
  description: "Website template — foundation phase",
} as const;

export type NavItem = { label: string; href: string };

export const marketingNav: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Các mẫu Website", href: "/templates" },
  { label: "Tư vấn dịch vụ", href: "/about" },
  { label: "Gói dịch vụ", href: "/pricing" },
  { label: "Yêu thích", href: "/favorites" },
];

export const docsNav: NavItem[] = [
  { label: "Tổng quan", href: "/docs" },
  { label: "Bắt đầu", href: "/docs/getting-started" },
];

export const dashboardNav: NavItem[] = [
  { label: "Trở về trang chủ", href: "/" },
  { label: "Đơn hàng", href: "/orders" },
  { label: "Cài đặt", href: "/settings" },
];

/** Nhóm route để scale — map với Figma Section / khu vực site */
export const sitemap = {
  marketing: ["/", "/templates", "/about", "/pricing", "/favorites"],
  blog: [] as string[],
  docs: ["/docs", "/docs/getting-started"],
  auth: ["/login", "/register"],
  dashboard: ["/dashboard", "/orders", "/settings"],
} as const;

export const footerColumns = [
  {
    title: "Về Visstemp",
    links: [
      { label: "Giới thiệu về Visstemp", href: "/about" },
      { label: "Câu chuyện phát triển", href: "/about" },
      { label: "Khách hàng", href: "/pricing" },
      { label: "Tuyển dụng", href: "/about" },
      { label: "Liên hệ", href: "/about" },
      { label: "Blog", href: "/docs" },
    ],
  },
  {
    title: "Giải pháp website",
    links: [
      { label: "Đăng ký tên miền", href: "/pricing" },
      { label: "Thiết kế website chuyên nghiệp", href: "/pricing" },
      { label: "Web hosting", href: "/pricing" },
      { label: "Dịch vụ quản trị website", href: "/pricing" },
      { label: "Landing page chuyển đổi", href: "/pricing" },
      { label: "Mẫu website", href: "/" },
    ],
  },
  {
    title: "Giải pháp marketing online",
    links: [
      { label: "Dịch vụ SEO", href: "/pricing" },
      { label: "Digital marketing", href: "/pricing" },
      { label: "Quảng cáo đa kênh", href: "/pricing" },
      { label: "Tư vấn chiến lược", href: "/about" },
      { label: "Phòng marketing thuê ngoài", href: "/pricing" },
      { label: "Affiliate", href: "/pricing" },
    ],
  },
  {
    title: "Hosting / VPS / Server",
    links: [
      { label: "Hosting cao cấp", href: "/pricing" },
      { label: "Cloud VPS", href: "/pricing" },
      { label: "Thuê máy chủ", href: "/pricing" },
      { label: "Email doanh nghiệp", href: "/pricing" },
      { label: "Video protect solution", href: "/pricing" },
      { label: "Chuyển hosting", href: "/pricing" },
    ],
  },
] as const;

export const footerContact = {
  email: "info@visstemp.vn",
  address: "1073/2/3 Cách Mạng Tháng Tám, P. Tân Sơn Nhì, TP.HCM",
} as const;

export const footerLegal = [
  { name: "VISSTEMP.Media", taxCode: "0313728397", account: "216341549", bank: "ACB" },
  {
    name: "VISSTEMP.Software",
    taxCode: "0316694442",
    account: "17268177",
    bank: "ACB",
  },
  { name: "VISSTEMP.Host", taxCode: "0317401755", account: "1900636048", bank: "ACB" },
] as const;

import Image from "next/image";
import { AppLink } from "@/components/shared/app-link";

const aboutLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Danh sách mẫu", href: "/templates" },
  { label: "Liên hệ tư vấn", href: "/about" },
  { label: "Gói dịch vụ", href: "/pricing" },
  { label: "Yêu thích", href: "/templates" },
  { label: "Giỏ hàng", href: "/templates" },
  { label: "Đăng nhập", href: "/login" },
] as const;

const policyLinks = [
  { label: "Chính sách thanh toán", href: "/pricing" },
  { label: "Điều khoản dịch vụ", href: "/pricing" },
  { label: "Hướng dẫn mua hàng", href: "/templates" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a2b5b_0%,#132a74_38%,#3a2c86_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(88,190,255,0.26),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(125,120,255,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-40 -top-24 size-[34rem] rounded-full bg-[#6dd7ff]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-10 size-[30rem] rounded-full bg-[#9a7dff]/18 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-10 lg:pb-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md">
                <Image
                  src="/images/avatars/avatar_1.png"
                  alt="VISSTEMP"
                  width={40}
                  height={40}
                  className="size-8 rounded-xl object-cover"
                />
              </span>
              <p className="text-lg font-extrabold tracking-tight">VISSTEMP</p>
            </div>

            <p className="text-sm font-semibold text-white/85">
              Công ty cổ phần VISSSOFT
            </p>

            <div className="space-y-2 text-sm text-white/75">
              <p>Địa chỉ</p>
              <p className="text-white/85">
                Số 123 Nguyễn Ngọc Nại, P. Phương Liệt, TP. Hà Nội
              </p>
              <p className="pt-1">Số điện thoại</p>
              <p className="text-white/85">0912 040 482</p>
              <p className="pt-1">Email</p>
              <p className="text-white/85">hanh.nguyenv@visssoft.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-extrabold text-white/90">Về chúng tôi</p>
            <nav className="grid gap-2">
              {aboutLinks.map((link) => (
                <AppLink
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-extrabold text-white/90">Chính sách</p>
            <nav className="grid gap-2">
              {policyLinks.map((link) => (
                <AppLink
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {link.label}
                </AppLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-white/15" />

        <div className="mt-6 text-xs text-white/65">© All rights reserved VISSSOFT</div>
      </div>
    </footer>
  );
}

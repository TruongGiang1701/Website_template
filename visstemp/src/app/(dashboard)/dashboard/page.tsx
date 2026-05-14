"use client";

import { Container } from "@/components/shared/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/useAuth";
import { useCart } from "@/lib/useCart";
import { useFavorites } from "@/lib/useFavorites";

export default function DashboardHomePage() {
  const auth = useAuth();
  const cart = useCart();
  const favorites = useFavorites();

  return (
    <Container className="max-w-5xl space-y-6">
      <div>
        <Heading as="h1">Tổng quan</Heading>
        <Text muted>
          {auth.user
            ? `Xin chào ${auth.user.name}, đây là tổng quan nhanh tài khoản của bạn.`
            : "Đăng nhập để xem thông tin tài khoản và cài đặt cá nhân."}
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Tài khoản" value={auth.user?.email ?? "Chưa đăng nhập"} />
        <InfoCard label="Mẫu yêu thích" value={`${favorites.ids.length}`} />
        <InfoCard label="Giỏ hàng" value={`${cart.count} sản phẩm`} />
      </div>

      <div className="rounded-2xl border border-[#d7e4f6] bg-white p-5 shadow-sm">
        <p className="text-sm font-extrabold text-[#173a66]">Gợi ý nhanh</p>
        <ul className="mt-3 space-y-2 text-sm font-semibold text-[#2b5e95]/85">
          <li>• Truy cập `Cài đặt` để đổi tên hiển thị và tuỳ chọn nhận thông báo.</li>
          <li>
            • Các dữ liệu tài khoản hiện được lưu bằng localStorage trên trình duyệt.
          </li>
          <li>
            • Bạn có thể tiếp tục thêm mẫu vào `Yêu thích` hoặc `Giỏ hàng` bất cứ lúc
            nào.
          </li>
        </ul>
      </div>
    </Container>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d7e4f6] bg-white p-4 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2b5e95]/70">
        {label}
      </p>
      <p className="mt-2 text-sm font-extrabold text-[#173a66]">{value}</p>
    </div>
  );
}

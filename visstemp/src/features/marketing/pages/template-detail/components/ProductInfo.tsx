"use client";

import { useRouter } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import { formatPrice } from "@/features/marketing/pages/template-detail/template-detail.utils";
import { useCart } from "@/lib/useCart";

type ProductInfoProps = {
  item: HomeTemplateItem;
};

const qualityBullets = [
  "Chất lượng: giao diện chuẩn UX/UI, code sạch dễ mở rộng.",
  "Hỗ trợ: tư vấn triển khai & tối ưu vận hành theo nhu cầu thực tế.",
  "Bảo hành: xử lý lỗi kỹ thuật và cập nhật ổn định sau bàn giao.",
  "Tối ưu UX/UI: tối ưu chuyển đổi cho cả desktop và mobile.",
];

export function ProductInfo({ item }: ProductInfoProps) {
  const router = useRouter();
  const cart = useCart();
  return (
    <aside className="rounded-2xl border border-[#d7e4f6] bg-white/90 p-5 shadow-sm backdrop-blur-sm">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#2b5e95]/80">
        Tổng giá
      </p>
      <p className="mt-1 text-3xl font-extrabold text-[#dc2f2f]">{formatPrice(item)}</p>

      <div className="mt-3 flex items-center gap-1 text-[#f5b100]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <StarIcon key={idx} className="size-4" />
        ))}
      </div>

      <ul className="mt-5 space-y-3 text-sm font-semibold text-[#1b3a66]/85">
        {qualityBullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-1 text-[#0f67be]">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-2">
        <AppLink
          href={item.href}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#0f67be]/25 bg-white text-xs font-extrabold text-[#0f67be] transition hover:bg-[#eef5ff]"
        >
          Trải nghiệm Website
        </AppLink>
        <button
          type="button"
          onClick={() => {
            void (async () => {
              await cart.add(item.id, 1);
              router.push("/cart");
            })();
          }}
          className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#0f67be] to-[#2f8eee] text-xs font-extrabold text-white shadow-sm transition hover:brightness-95"
        >
          Mua ngay
        </button>
      </div>
    </aside>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.3l-5.5 3 1.1-6.2L3 9.6l6.2-.9L12 3l2.8 5.7 6.2.9-4.6 4.5 1.1 6.2z" />
    </svg>
  );
}

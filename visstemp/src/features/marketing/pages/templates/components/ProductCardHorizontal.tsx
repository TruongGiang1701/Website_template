"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";

type Props = {
  item: HomeTemplateItem;
  liked: boolean;
  onToggleLike: () => void;
  onOpenModal: () => void;
};

export function ProductCardHorizontal({
  item,
  liked,
  onToggleLike,
  onOpenModal,
}: Props) {
  const price = item.price ?? "5.000.000 VND";

  return (
    <article
      onClick={onOpenModal}
      className={cn(
        "group grid cursor-pointer gap-4 rounded-2xl border border-[#d7e4f6] bg-white/90 p-4 shadow-sm backdrop-blur-sm",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        "md:grid-cols-[220px_minmax(0,1fr)_220px]",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#e3eefc] bg-white">
        <Image
          src={item.image}
          alt={item.title}
          width={520}
          height={360}
          className="h-40 w-full object-cover md:h-full"
        />
        <button
          type="button"
          aria-label={`Yêu thích ${item.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
          className={cn(
            "absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-sm",
            liked ? "text-rose-500" : "text-[#1b4f86]/70 hover:text-[#1b4f86]",
          )}
        >
          <HeartIcon className="size-5" filled={liked} />
        </button>
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-sm font-extrabold text-[#173a66] md:text-base">
          Trang web:{" "}
          <span className="font-semibold text-[#173a66]/80">{item.title}</span>
        </p>

        <ul className="space-y-1 text-xs font-semibold text-[#2b5e95]/80">
          <li>• Web chuẩn UI/UX, tương thích thiết bị</li>
          <li>• Có thể tuỳ biến theo lĩnh vực/nhu cầu</li>
          <li>• Phù hợp triển khai nhanh &amp; tối ưu chuyển đổi</li>
        </ul>

        <div className="flex flex-wrap gap-2 pt-1">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={`${item.id}-${tag}`}
              className="rounded-full border border-[#d4e2f4] bg-white px-3 py-1 text-[11px] font-semibold text-[#2f5c93]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:items-end">
        <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
          <p className="text-sm font-extrabold text-[#173a66]">{price}</p>
          <div className="flex items-center gap-1 text-[#f5b100]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <StarIcon key={idx} className="size-4" />
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            className="h-10 rounded-full px-5 text-xs font-extrabold"
          >
            Mua ngay
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            className="h-10 rounded-full border border-[#0f67be]/25 bg-white text-xs font-extrabold text-[#0f67be]"
          >
            Trải nghiệm
          </Button>
        </div>
      </div>
    </article>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      fill={filled ? "currentColor" : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
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

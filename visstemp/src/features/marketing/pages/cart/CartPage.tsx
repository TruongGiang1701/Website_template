"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AppLink } from "@/components/shared/app-link";
import { useCart } from "@/lib/useCart";
import { useResolvedCatalogItems } from "@/lib/catalog/use-resolved-catalog-items";
import { cn } from "@/lib/utils";
import { type HomeTemplateItem } from "@/features/marketing/pages/home/home.data";

function parsePriceVnd(raw: string | undefined) {
  const digits = (raw ?? "").replace(/[^\d]/g, "");
  const num = digits ? Number(digits) : 0;
  return Number.isFinite(num) ? num : 0;
}

function formatVnd(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toLocaleString("vi-VN")} VND`;
}

export function CartPage() {
  const cart = useCart();
  const cartIds = useMemo(() => cart.lines.map((l) => l.id), [cart.lines]);
  const { map: catalogMap, loading: catalogLoading } = useResolvedCatalogItems(cartIds);

  const items = useMemo(() => {
    return cart.lines
      .map((line) => {
        const item = catalogMap.get(line.id);
        if (!item) return null;
        return { item, qty: line.qty };
      })
      .filter(Boolean) as { item: HomeTemplateItem; qty: number }[];
  }, [cart.lines, catalogMap]);

  const total = useMemo(() => {
    return items.reduce((sum, row) => sum + parsePriceVnd(row.item.price) * row.qty, 0);
  }, [items]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative">
        <section className="relative overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <Image
              src="/images/categories/template_website.jpg"
              alt="Giỏ hàng"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_center]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.62),transparent_52%),linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.62)_46%,rgba(255,255,255,0)_74%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-10">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-[#194a84] sm:text-5xl lg:text-6xl">
                Kiểm tra giỏ hàng và
                <br />
                thanh toán
              </h1>
            </div>
          </div>
        </section>

        <div className="bg-white/95">
          <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <Section
        spacing="md"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_22%_10%,rgba(149,210,255,0.42),transparent_55%),linear-gradient(180deg,#f1fbff_0%,#ffffff_45%,#f6fbff_100%)]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-[#0f67be] sm:text-4xl">
            Giỏ hàng
          </h2>

          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-[56rem] rounded-[2rem] border border-[#d7e4f6] bg-white/90 shadow-[0_26px_70px_-55px_rgba(10,31,68,0.5)] backdrop-blur-sm">
              <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_280px] md:gap-8 md:p-8">
                <div className="space-y-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#1b3a66]/70">
                    Danh sách sản phẩm
                  </p>

                  {catalogLoading && cart.lines.length > 0 ? (
                    <div className="rounded-2xl border border-[#cfe0f7] bg-white py-10 text-center text-sm font-semibold text-[#2b5e95]/80">
                      Đang tải thông tin sản phẩm…
                    </div>
                  ) : cart.lines.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white py-10 text-center text-sm font-semibold text-[#2b5e95]/80">
                      Giỏ hàng đang trống. Hãy chọn một mẫu website bạn thích.
                    </div>
                  ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white py-10 text-center text-sm font-semibold text-[#2b5e95]/80">
                      Không tải được sản phẩm trong giỏ. Có thể mẫu đã gỡ hoặc dữ liệu catalog chưa
                      đồng bộ.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#e6f0ff] rounded-2xl border border-[#e6f0ff] bg-white">
                      {items.map(({ item, qty }) => (
                        <CartRow
                          key={item.id}
                          item={item}
                          qty={qty}
                          onRemove={() => void cart.remove(item.id)}
                        />
                      ))}
                    </div>
                  )}

                  <AppLink
                    href="/templates"
                    className="inline-flex text-xs font-extrabold uppercase tracking-wide text-[#1b3a66]/75 hover:text-[#0f67be]"
                  >
                    Tiếp tục mua sắm
                  </AppLink>
                </div>

                <div className="rounded-2xl border border-[#e6f0ff] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-[#1b3a66]/70">
                      Tổng thanh toán:
                    </span>
                    <span className="text-sm font-extrabold text-[#dc2f2f]">
                      {formatVnd(total)}
                    </span>
                  </div>

                  {items.length === 0 || catalogLoading ? (
                    <div
                      className={cn(
                        "mt-4 inline-flex h-11 w-full items-center justify-center rounded-full",
                        "bg-gradient-to-r from-[#0f67be] to-[#d62828]",
                        "text-xs font-extrabold text-white shadow-md",
                        "opacity-40",
                      )}
                      aria-disabled="true"
                    >
                      Liên hệ và thanh toán
                    </div>
                  ) : (
                    <AppLink
                      href="/checkout"
                      className={cn(
                        "mt-4 inline-flex h-11 w-full items-center justify-center rounded-full",
                        "bg-gradient-to-r from-[#0f67be] to-[#d62828]",
                        "text-xs font-extrabold text-white shadow-md transition hover:brightness-95",
                      )}
                    >
                      Liên hệ và thanh toán
                    </AppLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function CartRow({
  item,
  qty,
  onRemove,
}: {
  item: HomeTemplateItem;
  qty: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <button
        type="button"
        aria-label="Xóa khỏi giỏ hàng"
        onClick={onRemove}
        className="inline-flex size-8 items-center justify-center rounded-full text-[#1b3a66]/60 transition hover:bg-[#f2f7ff] hover:text-[#0f67be]"
      >
        <span className="text-lg leading-none">×</span>
      </button>

      <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-[#d7e4f6] bg-white">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs font-extrabold text-[#173a66]">
          {item.title}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-[#2b5e95]/70">SL: {qty}</p>
      </div>

      <div className="text-right">
        <p className="text-[11px] font-semibold text-[#1b3a66]/60">Giá</p>
        <p className="text-xs font-extrabold text-[#dc2f2f]">{item.price ?? "0 VND"}</p>
      </div>
    </div>
  );
}

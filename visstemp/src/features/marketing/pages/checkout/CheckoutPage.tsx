"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AppLink } from "@/components/shared/app-link";
import { readSession } from "@/app/(auth)/_components/auth-storage";
import { createOrder, mergeCartAfterLogin } from "@/lib/api/orders";
import { useAuth } from "@/lib/useAuth";
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

export function CheckoutPage() {
  const auth = useAuth();
  const cart = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");
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

  const totalQty = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, row) => sum + parsePriceVnd(row.item.price) * row.qty, 0),
    [items],
  );

  async function handleCheckout() {
    if (submitting) return;
    setSubmitError(null);
    setCreatedOrderCode(null);
    if (items.length === 0) {
      setSubmitError("Giỏ hàng đang trống, chưa thể tạo đơn.");
      return;
    }

    const token = readSession()?.accessToken?.trim() ?? "";
    if (!token) {
      setSubmitError("Vui lòng đăng nhập trước khi thanh toán.");
      return;
    }

    setSubmitting(true);
    try {
      await mergeCartAfterLogin(token);
      const order = await createOrder(token, {
        contact_name: contactName.trim() || auth.user?.name || undefined,
        contact_email: contactEmail.trim() || auth.user?.email || undefined,
        note: note.trim() || undefined,
      });
      setSubmitted(true);
      setCreatedOrderCode(order.code);
      await cart.refresh();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Không thể tạo đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative">
        <section className="relative overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <Image
              src="/images/categories/template_website.jpg"
              alt="Thanh toán"
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
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
            <span className="text-[#0f67be]">Thanh</span>{" "}
            <span className="text-[#d62828]">toán</span>
          </h2>

          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-[56rem] rounded-[2rem] border border-[#d7e4f6] bg-white/90 shadow-[0_26px_70px_-55px_rgba(10,31,68,0.5)] backdrop-blur-sm">
              {catalogLoading && cart.lines.length > 0 ? (
                <div className="p-8">
                  <div className="rounded-2xl border border-[#cfe0f7] bg-white py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                    Đang tải thông tin sản phẩm…
                  </div>
                </div>
              ) : cart.lines.length === 0 ? (
                <div className="p-8">
                  <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                    Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.
                  </div>
                  <div className="mt-6 flex justify-center">
                    <AppLink
                      href="/templates"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0f67be] px-7 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#0d5aa6]"
                    >
                      Chọn mẫu website
                    </AppLink>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="p-8">
                  <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                    Không tải được sản phẩm trong giỏ. Vui lòng quay lại catalog hoặc làm mới
                    trang.
                  </div>
                  <div className="mt-6 flex justify-center">
                    <AppLink
                      href="/cart"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0f67be] px-7 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#0d5aa6]"
                    >
                      Về giỏ hàng
                    </AppLink>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_280px] md:gap-8 md:p-8">
                  <div className="space-y-6">
                    {submitted ? (
                      <div className="rounded-2xl border border-[#cfe0f7] bg-[#f2f8ff] p-5 text-sm font-semibold text-[#1b3a66]">
                        Đơn hàng đã được tạo thành công.
                        {createdOrderCode ? (
                          <>
                            {" "}
                            Mã đơn: <span className="font-extrabold">{createdOrderCode}</span>.
                            <AppLink href="/orders" className="ml-1 text-[#0f67be] hover:underline">
                              Xem lịch sử đơn hàng
                            </AppLink>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    {submitError ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-800">
                        {submitError}
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      <p className="text-sm font-extrabold text-[#0a1f44]">
                        Thông tin liên hệ
                      </p>
                      <div className="grid gap-3">
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-[#1b3a66]/70">
                            Họ và tên
                          </span>
                          <input
                            className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-4 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10"
                            placeholder="Họ và tên"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-[#1b3a66]/70">
                            Email
                          </span>
                          <input
                            type="email"
                            className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-4 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10"
                            placeholder="Email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-[#1b3a66]/70">
                            Hãy cho chúng tôi biết về việc: bạn đang quan tâm đến
                          </span>
                          <textarea
                            className="min-h-24 w-full resize-none rounded-xl border border-[#e6f0ff] bg-white px-4 py-3 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10"
                            placeholder="Hãy cho chúng tôi biết về việc: bạn đang quan tâm đến..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-extrabold text-[#0a1f44]">
                        Thông tin thanh toán
                      </p>

                      <div className="flex items-center gap-2">
                        {["VISA", "MC", "AMEX", "PAY"].map((x) => (
                          <span
                            key={x}
                            className="inline-flex h-7 items-center justify-center rounded-md border border-[#e6f0ff] bg-white px-2 text-[10px] font-extrabold text-[#1b3a66]/70"
                          >
                            {x}
                          </span>
                        ))}
                      </div>

                      <div className="grid gap-3">
                        <label className="space-y-1.5">
                          <span className="text-xs font-semibold text-[#1b3a66]/70">
                            Số thẻ *
                          </span>
                          <input
                            inputMode="numeric"
                            className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-4 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10"
                            placeholder="•••• •••• •••• ••••"
                          />
                        </label>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-[#1b3a66]/70">
                              Ngày hết hạn *
                            </span>
                            <select className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-3 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10">
                              <option>Tháng</option>
                              {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {String(i + 1).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-[#1b3a66]/70">
                              &nbsp;
                            </span>
                            <select className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-3 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10">
                              <option>Năm</option>
                              {Array.from({ length: 8 }).map((_, i) => {
                                const y = new Date().getFullYear() + i;
                                return (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                );
                              })}
                            </select>
                          </label>
                          <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-[#1b3a66]/70">
                              Mã CVV *
                            </span>
                            <input
                              inputMode="numeric"
                              className="h-10 w-full rounded-xl border border-[#e6f0ff] bg-white px-4 text-sm font-semibold text-[#1b3a66] outline-none transition focus:border-[#0f67be]/40 focus:ring-4 focus:ring-[#0f67be]/10"
                              placeholder="CVV"
                            />
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleCheckout()}
                          disabled={submitting}
                          className={cn(
                            "mt-1 inline-flex h-11 w-full items-center justify-center rounded-full",
                            "bg-gradient-to-r from-[#0f67be] to-[#d62828]",
                            "text-xs font-extrabold text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50",
                          )}
                        >
                          {submitting ? "Đang tạo đơn..." : "Thanh toán"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e6f0ff] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-extrabold text-[#1b3a66]/70">
                        Tổng mẫu:
                      </span>
                      <span className="text-xs font-extrabold text-[#dc2f2f]">
                        {totalQty} Mẫu
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {items.slice(0, 3).map(({ item }) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <p className="line-clamp-2 text-[11px] font-semibold text-[#1b3a66]">
                            {item.title}
                          </p>
                          <p className="whitespace-nowrap text-[11px] font-extrabold text-[#dc2f2f]">
                            {item.price ?? "0 VND"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-[#e6f0ff] pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-extrabold text-[#1b3a66]/70">
                          Tổng thanh toán:
                        </span>
                        <span className="text-xs font-extrabold text-[#dc2f2f]">
                          {formatVnd(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

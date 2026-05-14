"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function FooterCTA({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <section className={cn("relative", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(105deg,#0a2e63_0%,#0f67be_36%,#17c3e6_100%)] shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.14),transparent_55%)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-[22rem] rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-28 bottom-[-10rem] size-[26rem] rounded-full bg-[#5be7ff]/20 blur-3xl" />

          <div className="relative grid gap-8 p-8 text-white sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-3">
              <h3 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
                Xây dựng website
                <br />
                của bạn ngay?
              </h3>
              <p className="max-w-lg text-sm text-white/85 sm:text-base">
                Các tổ chức, doanh nghiệp và cá nhân có thể hiện thực hoá website của
                mình như mong muốn với hệ thống webtemplate và đội ngũ chuyên gia của
                VISSTEMP.
              </p>
            </div>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên"
                  className="h-11 w-full rounded-full border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur-md focus:border-white/55"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  className="h-11 w-full rounded-full border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur-md focus:border-white/55"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#0a2e63] shadow-md transition hover:bg-white/90"
              >
                Tư vấn miễn phí
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#0f67be] text-white">
                  →
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

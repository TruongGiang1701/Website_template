"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ContactConsulting({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className={cn("py-10 sm:py-12", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-xl font-extrabold text-[#173a66] sm:text-2xl">
          Liên hệ
        </h2>

        <div className="mt-6 rounded-2xl border border-[#d7e4f6] bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-extrabold text-[#173a66]">Thông tin liên hệ</p>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  setTimeout(() => setSent(false), 1600);
                  setName("");
                  setEmail("");
                  setMessage("");
                }}
              >
                <Field label="Họ và tên">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên"
                    className="h-10 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
                    required
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="h-10 w-full rounded-xl border border-[#e2e6ed] bg-white px-4 text-sm outline-none focus:border-[#9bc0e7]"
                    required
                  />
                </Field>
                <Field label="Hãy cho chúng tôi biết về việc bạn đang quan tâm đến">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hãy cho chúng tôi biết về việc bạn đang quan tâm đến"
                    className="min-h-24 w-full resize-none rounded-xl border border-[#e2e6ed] bg-white px-4 py-3 text-sm outline-none focus:border-[#9bc0e7]"
                    required
                  />
                </Field>

                <button
                  type="submit"
                  className="h-11 w-full rounded-full bg-gradient-to-r from-[#0f67be] to-[#d62828] text-sm font-extrabold text-white shadow-md transition hover:brightness-95"
                >
                  {sent ? "Đã gửi!" : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
            
            <div className="relative">
              <div className="mx-auto flex max-w-[520px] items-center justify-center">
                <div className="relative">
                  <Image
                    src="/images/products/product_1.png"
                    alt="Template preview 1"
                    width={220}
                    height={160}
                    className="relative z-10 rounded-2xl border border-[#d7e4f6] bg-white shadow-md"
                  />
                  <Image
                    src="/images/products/product_2.png"
                    alt="Template preview 2"
                    width={200}
                    height={150}
                    className="absolute -right-24 -top-6 rounded-2xl border border-[#d7e4f6] bg-white shadow-md"
                  />
                  <Image
                    src="/images/products/product_3.png"
                    alt="Template preview 3"
                    width={200}
                    height={150}
                    className="absolute -right-12 top-20 rounded-2xl border border-[#d7e4f6] bg-white shadow-md"
                  />
                  <Image
                    src="/images/products/product_4.png"
                    alt="Template preview 4"
                    width={200}
                    height={150}
                    loading="eager"
                    className="absolute -left-24 top-10 rounded-2xl border border-[#d7e4f6] bg-white shadow-md"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-[#7aa7ff]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 size-44 rounded-full bg-[#6dd7ff]/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-[#173a66]/85">{label}</span>
      {children}
    </label>
  );
}

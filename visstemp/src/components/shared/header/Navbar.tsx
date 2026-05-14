"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/useAuth";
import { useCart } from "@/lib/useCart";
import { cn } from "@/lib/utils";
import { marketingNav, site } from "@/config/site";

type ScrollState = {
  isHidden: boolean;
  isAtTop: boolean;
};

export function Navbar() {
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const cart = useCart();
  const auth = useAuth();

  const [scrollState, setScrollState] = useState<ScrollState>({
    isHidden: false,
    isAtTop: true,
  });

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const lastY = lastYRef.current;
        lastYRef.current = y;

        const isAtTop = y < 12;
        const delta = y - lastY;
        const isScrollingDown = delta > 0;

        // small deadzone to avoid jitter on trackpads
        if (Math.abs(delta) < 6) {
          setScrollState((prev) => ({ ...prev, isAtTop }));
          tickingRef.current = false;
          return;
        }

        setScrollState({
          isAtTop,
          // hide only after user left the top area
          isHidden: !isAtTop && isScrollingDown,
        });

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-transform duration-300 will-change-transform",
        scrollState.isHidden ? "-translate-y-[110%]" : "translate-y-0",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/10 to-transparent" />
      <Container className="max-w-7xl">
        <div className="pt-4 sm:pt-5">
          <div
            className={cn(
              "flex h-16 items-center justify-between gap-4 rounded-full",
              "border-2 border-[#0a1f44]/25 bg-white/85 px-5 shadow-lg backdrop-blur-md sm:px-7",
              "ring-1 ring-[#0a1f44]/10",
            )}
          >
            <AppLink
              href="/"
              className="flex items-center gap-3 text-sm font-extrabold tracking-wide text-[#0a1f44] hover:text-[#0a1f44]/80"
            >
              <span className="relative inline-flex size-10 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
                <Image
                  src="/images/avatars/avatar_1.png"
                  alt="Visstemp avatar"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="leading-none">
                <span className="block">{site.name}</span>
                <span className="mt-0.5 block text-[10px] font-semibold tracking-normal text-[#4b6aa0]">
                  Premium Web Solutions
                </span>
              </span>
            </AppLink>

            <nav className="hidden flex-nowrap items-center gap-4 text-xs font-semibold text-[#0a1f44] lg:flex xl:gap-6">
              {marketingNav.map((item) => (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-2 py-1 text-[#1b3a66] transition-colors hover:bg-[#eaf3ff] hover:text-[#0a1f44]"
                >
                  {item.label}
                </AppLink>
              ))}
              <LangToggle className="ml-1 whitespace-nowrap" />
            </nav>

            <div className="flex items-center gap-2">
              <AppLink
                href="/cart"
                aria-label="Giỏ hàng"
                className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#0a1f44]/15 bg-white/70 text-[#1b3a66] shadow-sm backdrop-blur-md transition hover:bg-white"
              >
                <CartIcon className="size-5" />
                {cart.count > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d62828] px-1 text-[11px] font-extrabold text-white shadow-sm">
                    {cart.count > 9 ? "9+" : cart.count}
                  </span>
                ) : null}
              </AppLink>

              {auth.isAuthenticated && auth.user ? (
                <div className="hidden items-center gap-2 md:flex">
                  <AppLink
                    href="/settings"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0a1f44]/15 bg-white/70 px-3 py-2 text-xs font-extrabold text-[#1b3a66] shadow-sm backdrop-blur-md transition hover:bg-white"
                  >
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#0f67be] to-[#d62828] text-[11px] text-white">
                      {auth.user.initials}
                    </span>
                    <span className="max-w-[8rem] truncate">{auth.user.name}</span>
                  </AppLink>
                </div>
              ) : (
                <>
                  <AppLink
                    href="/login"
                    className="hidden rounded-full border border-[#0a1f44]/15 bg-white/70 px-4 py-2 text-xs font-extrabold text-[#1b3a66] shadow-sm backdrop-blur-md transition hover:bg-white md:inline-flex"
                  >
                    Đăng nhập
                  </AppLink>
                  <Button
                    asChild
                    size="sm"
                    className="h-10 rounded-full bg-[#0f67be] px-5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0d5aa6]"
                  >
                    <AppLink href="/register">Đăng ký</AppLink>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto text-xs font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {marketingNav.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/60 px-3 py-1 text-[#1b3a66] shadow-sm backdrop-blur-sm hover:bg-white/75"
              >
                {item.label}
              </AppLink>
            ))}
            <LangToggle className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/60 px-3 py-1 text-[#1b3a66] shadow-sm backdrop-blur-sm hover:bg-white/75" />
          </div>
        </div>
      </Container>
    </header>
  );
}

function LangToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Ngôn ngữ"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-extrabold text-[#1b3a66] transition hover:bg-[#e3f0ff]",
        className,
      )}
    >
      <span>VI</span>
      <span className="text-[#9bb2d6]">|</span>
      <span className="font-semibold text-[#2d4f7f]/80">EN</span>
    </button>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.6L4 3H2" />
      <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  );
}

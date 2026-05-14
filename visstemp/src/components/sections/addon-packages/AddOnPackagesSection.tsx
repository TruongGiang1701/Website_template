"use client";

import { useMemo } from "react";
import { AppLink } from "@/components/shared/app-link";
import {
  homePricingOption2,
  type PricingPlan,
} from "@/features/marketing/pages/home/home.data";
import { cn } from "@/lib/utils";

type AddOnPackagesSectionProps = {
  className?: string;
  /**
   * Optional override data. Defaults to Premium + Care+ from home pricing data.
   */
  packages?: PricingPlan[];
};

export function AddOnPackagesSection({
  className,
  packages,
}: AddOnPackagesSectionProps) {
  const data = useMemo(() => {
    if (packages && packages.length >= 2) return packages.slice(0, 2);
    return homePricingOption2.plans.filter(
      (x) => x.id === "premium" || x.id === "care_plus",
    );
  }, [packages]);

  const premium = data[0];
  const care = data[1];

  if (!premium || !care) return null;

  return (
    <section className={cn("space-y-6", className)}>
      <h2 className="text-center text-2xl font-extrabold tracking-wide sm:text-3xl">
        <span className="text-[#0f67be]">GÓI DỊCH VỤ</span>{" "}
        <span className="text-[#6d6b86]">CÓ THỂ</span>{" "}
        <span className="text-[#d62828]">MUA KÈM</span>
      </h2>

      <div className="rounded-[2.5rem] bg-white p-5 shadow-[0_18px_70px_-55px_rgba(10,31,68,0.55)] sm:p-8 lg:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <PackageCardPremium plan={premium} />
          <PackageCardCare plan={care} />
        </div>
      </div>
    </section>
  );
}

function PackageCardPremium({ plan }: { plan: PricingPlan }) {
  return (
    <article className="relative rounded-[2rem] p-6 shadow-[0_26px_80px_-60px_rgba(10,31,68,0.65)] sm:p-8">
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(165,220,255,0.9),transparent_40%),radial-gradient(circle_at_65%_26%,rgba(196,130,255,0.7),transparent_45%),radial-gradient(circle_at_35%_72%,rgba(85,255,235,0.55),transparent_52%),radial-gradient(circle_at_82%_78%,rgba(255,170,190,0.55),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-white/35" />
        <div className="absolute inset-0 opacity-20 [background-image:url('/images/bg/noise.png')]" />
      </div>

      <BadgeRecommend />

      <div className="relative">
        <h3 className="text-2xl font-extrabold uppercase tracking-wide text-black sm:text-[1.75rem]">
          {plan.name}
        </h3>
        <p className="mt-2 max-w-[28rem] text-sm font-semibold italic text-black/80">
          {plan.tagline}
        </p>

        <div className="mt-6">
          <CtaPill
            href={plan.cta.href}
            tone="premium"
            label={plan.cta.label}
            ariaLabel={`CTA ${plan.name}`}
          />
        </div>

        <FeatureList tone="blue" items={plan.features} className="mt-7 max-w-[34rem]" />

        {plan.giftNote ? (
          <div className="mt-8">
            <GiftPill note={plan.giftNote} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function PackageCardCare({ plan }: { plan: PricingPlan }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-black p-6 shadow-[0_22px_70px_-60px_rgba(10,31,68,0.55)] sm:p-8">
      <div className="absolute inset-0 bg-white" />

      <div className="relative">
        <h3 className="text-2xl font-extrabold uppercase tracking-wide text-black sm:text-[1.75rem]">
          {plan.name}
        </h3>
        <p className="mt-2 max-w-[28rem] text-sm font-semibold italic text-black/80">
          {plan.tagline}
        </p>

        <div className="mt-6">
          <CtaPill
            href={plan.cta.href}
            tone="mono"
            label={plan.cta.label}
            ariaLabel={`CTA ${plan.name}`}
          />
        </div>

        <FeatureList tone="black" items={plan.features} className="mt-7" />
      </div>
    </article>
  );
}

function BadgeRecommend() {
  return (
    <div className="absolute left-1/2 -top-7 z-20 -translate-x-1/2">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#0f67be]/40 bg-white px-5 py-2 text-xs font-extrabold text-[#0f67be] shadow-sm">
        <CrownIcon className="size-4" />
        KHUYÊN DÙNG
      </div>
    </div>
  );
}

function CtaPill({
  href,
  label,
  tone,
  ariaLabel,
}: {
  href: string;
  label: string;
  tone: "premium" | "mono";
  ariaLabel: string;
}) {
  return (
    <AppLink
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-4 rounded-full px-8 text-sm font-extrabold shadow-md transition hover:brightness-95",
        tone === "premium"
          ? "bg-gradient-to-r from-[#0f67be] to-[#2f8eee] text-white"
          : "border border-black bg-[#f2f2f2] text-black",
      )}
    >
      <span className="tracking-wide">{label}</span>
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full",
          tone === "premium" ? "bg-white text-black" : "bg-black text-white",
        )}
      >
        <ArrowRightIcon className="size-5" />
      </span>
    </AppLink>
  );
}

function FeatureList({
  items,
  tone,
  className,
}: {
  items: string[];
  tone: "blue" | "black";
  className?: string;
}) {
  return (
    <ul className={cn("space-y-4 text-sm font-semibold text-black", className)}>
      {items.slice(0, 4).map((text) => (
        <li key={text} className="flex gap-3">
          <span
            className={cn(
              "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
              tone === "blue" ? "bg-[#0f67be] text-white" : "bg-black text-white",
            )}
          >
            <CheckIcon className="size-4" />
          </span>
          <span className="text-pretty">{text}</span>
        </li>
      ))}
    </ul>
  );
}

function GiftPill({ note }: { note: string }) {
  const highlight = "WEBSITE CARE+";
  const parts = note.split(highlight);
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#1b3a66] shadow-sm">
      <GiftIcon className="size-5 text-[#0f67be]" />
      <span className="text-pretty">
        {parts[0]}
        <span className="text-[#0f67be]">{highlight}</span>
        {parts[1] ?? ""}
      </span>
    </div>
  );
}

function CrownIcon({ className }: { className?: string }) {
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
      <path d="M3 7l4 4 5-7 5 7 4-4v10H3V7z" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 12v10H4V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7h20v5H2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7h4a2 2 0 0 0 0-4c-1.5 0-2.5 1-4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H8a2 2 0 0 1 0-4c1.5 0 2.5 1 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

"use client";

import Image from "next/image";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[520px_minmax(0,1fr)]">
      <section className="flex items-center justify-center bg-[#f8f9fb] px-6 py-10 sm:px-10">
        <div className="w-full max-w-[380px] space-y-6">
          <AppLink href="/" className="inline-flex items-center gap-2 text-[#1b4f86]">
            <Image
              src="/images/avatars/avatar_1.png"
              alt="VISSTEMP"
              width={28}
              height={28}
              className="rounded-md object-cover"
            />
            <span className="text-xl font-extrabold tracking-tight">VISSTEMP</span>
          </AppLink>
          <h1 className="text-balance text-2xl font-extrabold leading-tight text-[#0f67be] sm:text-3xl">
            {title}
          </h1>
          <div>{children}</div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden border-l border-[#d7e4f6] lg:block">
        <Image
          src="/images/categories/login_register.png"
          alt="VISSTEMP landing templates"
          fill
          priority
          sizes="(max-width: 1024px) 0px, 100vw"
          className={cn("object-cover object-[60%_center]")}
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_55%)]" />
        </div>

        <div className="absolute left-10 top-12 max-w-[44rem] space-y-5 xl:left-14 xl:top-14">
          <h2 className="text-balance text-5xl font-extrabold leading-[1.05] text-[#1d4f86] xl:text-6xl">
            Xây dựng <span className="text-[#245fa8]">Website</span>{" "}
            <span className="text-[#d62828]">đẹp</span>
            <br />
            <span className="text-[#245fa8]">&amp; Landing Page</span>{" "}
            <span className="text-[#d62828]">hiệu quả</span>
          </h2>

          <p className="max-w-2xl text-base font-semibold leading-relaxed text-[#2b5e95]/85">
            VISSTEMP là một phần của hệ sinh thái VISSSOFT, là nền tảng chuyên cung cấp
            dịch vụ xây dựng website, app và landing page.
          </p>

          <div className="flex items-center gap-6 pt-2">
            <BadgeLogo label="VISSSOFT" />
            <BadgeLogo label="VISSTEMP" />
            <BadgeLogo label="VISSSOFT MEDIA" />
          </div>
        </div>
      </section>
    </div>
  );
}

function BadgeLogo({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-extrabold text-[#163f79]/85">
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/70 ring-1 ring-black/10">
        <svg viewBox="0 0 24 24" fill="none" className="size-4 text-[#163f79]">
          <path
            d="M7 17l10-10M9 7h8v8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="tracking-tight">{label}</span>
    </div>
  );
}

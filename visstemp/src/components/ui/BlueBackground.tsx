import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlueBackgroundProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: "deep" | "soft";
  withWaves?: boolean;
};

export default function BlueBackground({
  children,
  className,
  contentClassName,
  tone = "deep",
  withWaves = true,
}: BlueBackgroundProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden text-white",
        tone === "deep"
          ? "bg-gradient-to-b from-[#0f3b86] via-[#2f7ee1] to-[#7cc9ff]"
          : "bg-gradient-to-b from-[#2b7de8] via-[#64b8ff] to-[#b6e6ff]",
        className,
      )}
    >
      {withWaves ? (
        <>
          <Image
            src="/images/bg/wave-top.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={260}
            sizes="100vw"
            className="pointer-events-none absolute left-0 top-0 h-auto w-full opacity-60"
          />
          <Image
            src="/images/bg/wave-bottom.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={280}
            sizes="100vw"
            className="pointer-events-none absolute bottom-0 left-0 h-auto w-full opacity-70"
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-200px] top-1/2 h-[420px] w-[420px] rounded-full bg-blue-300/25 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('/images/bg/noise.png')]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}

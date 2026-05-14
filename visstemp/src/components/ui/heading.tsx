import * as React from "react";
import { cn } from "@/lib/utils";

const levelClass: Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", string> = {
  h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
};

export type HeadingProps = {
  as?: keyof typeof levelClass;
  className?: string;
  children: React.ReactNode;
};

export function Heading({ as = "h2", className, children }: HeadingProps) {
  const Comp = as;
  return <Comp className={cn(levelClass[as], className)}>{children}</Comp>;
}

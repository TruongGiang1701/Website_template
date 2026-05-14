import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "xs" | "sm" | "md" | "lg";
};

const gapClass: Record<NonNullable<StackProps["gap"]>, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export function Stack({ gap = "md", className, ...props }: StackProps) {
  return <div className={cn("flex flex-col", gapClass[gap], className)} {...props} />;
}

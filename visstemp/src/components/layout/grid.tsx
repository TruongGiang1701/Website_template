import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GridProps = HTMLAttributes<HTMLDivElement> & {
  cols?: 1 | 2 | 3 | 4;
};

const colClasses: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({ cols = 2, className, ...props }: GridProps) {
  return <div className={cn("grid gap-6", colClasses[cols], className)} {...props} />;
}

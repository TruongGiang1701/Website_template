import * as React from "react";
import { cn } from "@/lib/utils";

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  muted?: boolean;
  size?: "sm" | "base" | "lg";
};

const sizes = {
  sm: "text-sm leading-6",
  base: "text-base leading-7",
  lg: "text-lg leading-8",
};

export function Text({
  as: Comp = "p",
  muted,
  size = "base",
  className,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        sizes[size],
        muted ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

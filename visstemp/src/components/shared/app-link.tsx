import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

/** Wrapper Next.js Link + gộp className (primitive navigation). */
export function AppLink({ className, ...props }: AppLinkProps) {
  return (
    <Link className={cn("text-foreground transition-colors", className)} {...props} />
  );
}

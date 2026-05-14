import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  withContainer?: boolean;
  spacing?: "sm" | "md" | "lg";
};

const sectionSpacing: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-12",
  md: "py-16",
  lg: "py-section",
};

export function Section({
  className,
  children,
  withContainer = true,
  spacing = "lg",
  ...props
}: SectionProps) {
  const content = withContainer ? <Container>{children}</Container> : children;
  return (
    <section className={cn(sectionSpacing[spacing], className)} {...props}>
      {content}
    </section>
  );
}

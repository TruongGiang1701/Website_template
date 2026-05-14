import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PaginationProps = React.HTMLAttributes<HTMLElement>;
type PaginationLinkProps = {
  isActive?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex items-center gap-2", className)} {...props} />;
}

export function PaginationItem({
  className,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />;
}

export function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn("min-w-9", className)}
      {...props}
    />
  );
}

export function PaginationPrevious(props: PaginationLinkProps) {
  return <PaginationLink aria-label="Trang trước" {...props} />;
}

export function PaginationNext(props: PaginationLinkProps) {
  return <PaginationLink aria-label="Trang sau" {...props} />;
}

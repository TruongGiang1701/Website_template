import type { NavItem } from "@/config/site";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  title: string;
  items: readonly NavItem[];
  className?: string;
};

export function AppSidebar({ title, items, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "w-full shrink-0 border-b border-border bg-surface-elevated py-4 lg:w-56 lg:border-b-0 lg:border-r lg:py-8",
        className,
      )}
    >
      <div className="px-4 lg:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1">
          {items.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:block"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

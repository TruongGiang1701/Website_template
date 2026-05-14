"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/useFavorites";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import { HeroSection } from "@/features/marketing/pages/templates/components/HeroSection";
import {
  FilterSidebar,
  type FilterState,
} from "@/features/marketing/pages/templates/components/FilterSidebar";
import { ProductCardHorizontal } from "@/features/marketing/pages/templates/components/ProductCardHorizontal";
import { ClientsOption2 } from "@/features/marketing/sections/clients/ClientsOption2";
import { getTemplateDetailHref } from "@/features/marketing/pages/template-detail/template-detail.utils";
import {
  getProductsCatalogMeta,
  getProductsList,
  type ProductsListMeta,
} from "@/lib/api/products";
import { mapProductDtoToHomeTemplateItem } from "@/features/marketing/pages/templates/templates-catalog-map";

const PAGE_SIZE = 6;

function pageWindow(current: number, total: number, width: number) {
  if (total <= width) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let end = Math.min(total, current + Math.floor(width / 2));
  let start = Math.max(1, end - width + 1);
  end = Math.min(total, start + width - 1);
  start = Math.max(1, end - width + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function TemplatesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const favorites = useFavorites();
  const [filters, setFilters] = useState<FilterState>({
    sample: null,
    categories: new Set(),
    price: null,
  });
  const [page, setPage] = useState(1);

  const [counts, setCounts] = useState({
    website: 0,
    landing: 0,
    categories: {} as Record<string, number>,
  });
  const [countsError, setCountsError] = useState<string | null>(null);

  const [items, setItems] = useState<HomeTemplateItem[]>([]);
  const [listMeta, setListMeta] = useState<ProductsListMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pageCount: 1,
  });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  const categoryKey = useMemo(
    () => [...filters.categories].sort().join("|"),
    [filters.categories],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProductsCatalogMeta();
        if (cancelled) return;
        setCounts({
          website: data.website,
          landing: data.landing,
          categories: data.categories,
        });
        setCountsError(null);
      } catch (e) {
        if (cancelled) return;
        setCountsError(e instanceof Error ? e.message : "Lỗi tải thống kê");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (filters.sample === "landing") {
      queueMicrotask(() => {
        setItems([]);
        setListMeta({
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          pageCount: 1,
        });
        setListError(null);
        setListLoading(false);
      });
      return;
    }

    const ac = new AbortController();
    startTransition(() => {
      setListLoading(true);
    });

    (async () => {
      try {
        const groups =
          filters.categories.size > 0 ? [...filters.categories] : undefined;
        const { items: rows, meta } = await getProductsList({
          page,
          limit: PAGE_SIZE,
          q: query.trim() || undefined,
          groups,
          price: filters.price ?? undefined,
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        setItems(rows.map(mapProductDtoToHomeTemplateItem));
        setListMeta(meta);
        setListError(null);
        if (page > meta.pageCount) {
          setPage(Math.max(1, meta.pageCount));
        }
      } catch (e) {
        if (ac.signal.aborted) return;
        setListError(e instanceof Error ? e.message : "Lỗi tải danh sách");
        setItems([]);
      } finally {
        if (!ac.signal.aborted) setListLoading(false);
      }
    })();

    return () => ac.abort();
    // categoryKey đã phản ánh filters.categories (Set không ổn định cho deps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, filters.sample, filters.price, categoryKey, retryTick]);

  const pageCount = Math.max(1, listMeta.pageCount);
  const safePage = Math.min(page, pageCount);
  const pageDots = pageWindow(safePage, pageCount, 7);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />

      <Section
        spacing="md"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_42%,#f6fbff_100%)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_20%_20%,rgba(100,160,255,0.25),transparent_50%),radial-gradient(circle_at_80%_15%,rgba(190,120,255,0.22),transparent_45%)]" />

        <div className="relative">
          <div className="mx-auto flex w-full max-w-3xl gap-2 rounded-full border border-[#cfe0f7] bg-white p-1.5 shadow-sm">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Danh sách mẫu Website & Landing Page"
              className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
              aria-label="Tìm kiếm mẫu"
            />
            <Button
              className="h-10 rounded-full px-6 text-xs font-extrabold"
              type="button"
            >
              Tìm kiếm
            </Button>
          </div>

          {countsError ? (
            <p className="mt-3 text-center text-xs font-semibold text-amber-700">
              {countsError} (bộ lọc số lượng có thể chưa đúng)
            </p>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <FilterSidebar
              counts={counts}
              value={filters}
              onChange={(next) => {
                setFilters(next);
                setPage(1);
              }}
              className="sticky top-24 h-fit"
            />

            <div className="space-y-4">
              {listLoading ? (
                <div className="rounded-2xl border border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                  Đang tải danh sách từ máy chủ…
                </div>
              ) : null}

              {listError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-6 text-center text-sm font-semibold text-rose-800">
                  {listError}
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setRetryTick((t) => t + 1);
                        setPage(1);
                      }}
                    >
                      Thử lại
                    </Button>
                  </div>
                </div>
              ) : null}

              {!listLoading && !listError
                ? items.map((item) => (
                    <ProductCardHorizontal
                      key={item.id}
                      item={item}
                      liked={favorites.has(item.id)}
                      onToggleLike={() => favorites.toggle(item.id)}
                      onOpenModal={() => router.push(getTemplateDetailHref(item))}
                    />
                  ))
                : null}

              {!listLoading && !listError && items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                  Không tìm thấy mẫu phù hợp.
                </div>
              ) : null}

              {!listLoading && !listError && items.length > 0 ? (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <PageButton disabled={safePage === 1} onClick={() => setPage(1)}>
                    «
                  </PageButton>
                  <PageButton
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </PageButton>
                  {pageDots.map((p) => (
                    <PageDot
                      key={`p-${p}`}
                      active={p === safePage}
                      onClick={() => setPage(p)}
                      aria-label={`Trang ${p}`}
                    >
                      {p}
                    </PageDot>
                  ))}
                  <PageButton
                    disabled={safePage === pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    ›
                  </PageButton>
                  <PageButton
                    disabled={safePage === pageCount}
                    onClick={() => setPage(pageCount)}
                  >
                    »
                  </PageButton>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      <ClientsOption2 />
    </div>
  );
}

function PageButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#cfe0f7] bg-white text-sm font-extrabold text-[#2b5e95] shadow-sm",
        disabled ? "opacity-40" : "hover:bg-[#f2f7ff]",
      )}
    >
      {children}
    </button>
  );
}

function PageDot({
  children,
  active,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-extrabold shadow-sm",
        active
          ? "border-[#0f67be] bg-[#0f67be] text-white"
          : "border-[#cfe0f7] bg-white text-[#2b5e95] hover:bg-[#f2f7ff]",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

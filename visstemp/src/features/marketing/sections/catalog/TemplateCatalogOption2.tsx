"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
} from "@/components/ui/pagination";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/useFavorites";
import { homeTemplateOption2 } from "@/features/marketing/pages/home/home.data";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import { ProductCard } from "@/features/marketing/sections/catalog/components/ProductCard";
import { getTemplateDetailHref } from "@/features/marketing/pages/template-detail/template-detail.utils";
import { mapProductDtoToHomeTemplateItem } from "@/lib/catalog/map-product-to-home-item";
import type { ProductListItemDTO } from "@/types/products";

const INITIAL_VISIBLE_COUNT = 8;
const FETCH_LIMIT = 48;

type ListJson = {
  ok: boolean;
  data?: ProductListItemDTO[];
  error?: string;
};

export function TemplateCatalogOption2() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] =
    useState<(typeof homeTemplateOption2.allTabs)[number]>("Tất cả");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const favorites = useFavorites();

  const [remoteItems, setRemoteItems] = useState<HomeTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const sp = new URLSearchParams();
      sp.set("page", "1");
      sp.set("limit", String(FETCH_LIMIT));
      if (activeTab !== "Tất cả") sp.set("group", activeTab);

      const res = await fetch(`/api/products?${sp.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as ListJson;
      if (!res.ok || !json.ok || !json.data) {
        throw new Error(json.error || "Không tải được danh sách mẫu");
      }
      setRemoteItems(json.data.map(mapProductDtoToHomeTemplateItem));
    } catch (e: unknown) {
      setRemoteItems([]);
      setFetchError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return remoteItems;
    return remoteItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [remoteItems, query]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleItems.length < filteredItems.length;

  return (
    <Section
      spacing="md"
      className="relative overflow-hidden bg-[linear-gradient(145deg,#cde7ff_0%,#ddedff_32%,#edf6ff_100%)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_18%_20%,rgba(16,96,174,0.22),transparent_50%),radial-gradient(circle_at_82%_10%,rgba(123,79,230,0.2),transparent_45%)]" />
      <div className="relative space-y-7">
        <div className="mx-auto flex w-full max-w-3xl gap-2 rounded-full border border-[#6fa5de] bg-white p-1.5 shadow-sm">
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            placeholder={homeTemplateOption2.searchPlaceholder}
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
            aria-label="Tìm kiếm mẫu website"
          />
          <Button className="h-9 rounded-full px-6 text-xs font-semibold" type="button">
            Tìm kiếm
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {homeTemplateOption2.allTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                activeTab === tab
                  ? "border-primary bg-primary text-white"
                  : "border-[#9dc0e6] bg-white text-[#2f5c93] hover:bg-[#edf5ff]",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-destructive/30 bg-white/90 py-6 text-center text-sm font-semibold text-destructive">
            {fetchError}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/80 py-10 text-center">
            <Text muted>Đang tải mẫu từ máy chủ…</Text>
          </div>
        ) : null}

        {!loading ? (
          <Grid cols={4} className="gap-5">
            {visibleItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                liked={favorites.has(item.id)}
                onToggleLike={() => favorites.toggle(item.id)}
                onOpenModal={() => router.push(getTemplateDetailHref(item))}
                onTryWebsite={() => router.push(getTemplateDetailHref(item))}
                onViewDetails={() => router.push(getTemplateDetailHref(item))}
              />
            ))}
          </Grid>
        ) : null}

        {!loading && visibleItems.length === 0 && !fetchError ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/80 py-10 text-center">
            <Text muted>Không tìm thấy mẫu phù hợp.</Text>
          </div>
        ) : null}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext
                onClick={() => setVisibleCount((prev) => prev + 4)}
                disabled={!canLoadMore}
                className="h-11 rounded-full px-7 text-sm font-extrabold"
              >
                Xem thêm
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ml-2 size-4"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Section>
  );
}

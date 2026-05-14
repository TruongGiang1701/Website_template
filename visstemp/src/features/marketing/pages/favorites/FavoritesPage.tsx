"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/layout/section";
import { HeroSection } from "@/features/marketing/pages/templates/components/HeroSection";
import { ProductCardHorizontal } from "@/features/marketing/pages/templates/components/ProductCardHorizontal";
import { ProductModal } from "@/features/marketing/sections/catalog/components/ProductModal";
import { ClientsOption2 } from "@/features/marketing/sections/clients/ClientsOption2";
import { useFavorites } from "@/lib/useFavorites";
import { useResolvedCatalogItems } from "@/lib/catalog/use-resolved-catalog-items";
import { type HomeTemplateItem } from "@/features/marketing/pages/home/home.data";

export function FavoritesPage() {
  const favorites = useFavorites();
  const [selectedItem, setSelectedItem] = useState<HomeTemplateItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { map: catalogMap, loading, error } = useResolvedCatalogItems(favorites.ids);
  const listError = favorites.error ?? error;

  const items = useMemo(() => {
    return favorites.ids
      .map((id) => catalogMap.get(id))
      .filter((x): x is HomeTemplateItem => Boolean(x));
  }, [favorites.ids, catalogMap]);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />

      <Section
        spacing="md"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_42%,#f6fbff_100%)]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <h1 className="text-balance text-2xl font-extrabold text-[#173a66] sm:text-3xl">
            Yêu thích
          </h1>
          <p className="mt-2 text-sm font-semibold text-[#2b5e95]/80">
            Danh sách các mẫu website bạn đã thả tim.
          </p>

          <div className="mt-6 space-y-4">
            {listError ? (
              <div className="rounded-2xl border border-destructive/30 bg-white/80 py-12 text-center text-sm font-semibold text-destructive">
                {listError}
              </div>
            ) : favorites.loading && favorites.ids.length === 0 ? (
              <div className="rounded-2xl border border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                Đang tải danh sách yêu thích…
              </div>
            ) : loading && favorites.ids.length > 0 ? (
              <div className="rounded-2xl border border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                Đang tải danh sách yêu thích…
              </div>
            ) : favorites.ids.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                Bạn chưa có mẫu nào trong mục yêu thích.
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfe0f7] bg-white/80 py-12 text-center text-sm font-semibold text-[#2b5e95]/80">
                Không tải được các mẫu đã lưu. Có thể mẫu đã gỡ khỏi catalog.
              </div>
            ) : (
              items.map((item) => (
                <ProductCardHorizontal
                  key={item.id}
                  item={item}
                  liked={favorites.has(item.id)}
                  onToggleLike={() => favorites.toggle(item.id)}
                  onOpenModal={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          item={selectedItem}
          liked={selectedItem ? favorites.has(selectedItem.id) : false}
          onToggleLike={() =>
            selectedItem ? favorites.toggle(selectedItem.id) : undefined
          }
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
        />
      </Section>

      <ClientsOption2 />
    </div>
  );
}

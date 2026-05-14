"use client";

import { useEffect, useMemo, useState } from "react";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import type { ProductListItemDTO } from "@/types/products";
import { mapProductDtoToHomeTemplateItem } from "@/lib/catalog/map-product-to-home-item";

type ListJson = {
  ok: boolean;
  data?: ProductListItemDTO[];
  error?: string;
};

/** Giải mã `line.id` / favorites (legacy_key hoặc slug) → `HomeTemplateItem` qua `GET /api/products?ids=`. */
export function useResolvedCatalogItems(ids: string[]) {
  const key = useMemo(
    () => [...new Set(ids.map((i) => String(i).trim()).filter(Boolean))].sort().join(","),
    // Chuỗi ổn định theo nội dung id, tránh ref mảng đổi liên tục.
    [ids.join("\0")],
  );
  const [map, setMap] = useState<Map<string, HomeTemplateItem>>(() => new Map());
  const [loading, setLoading] = useState(ids.length > 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setMap(new Map());
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const sp = new URLSearchParams();
    sp.set("ids", key);
    sp.set("limit", "50");
    sp.set("page", "1");

    fetch(`/api/products?${sp.toString()}`)
      .then(async (r) => {
        const json = (await r.json()) as ListJson;
        if (!r.ok || !json.ok || !json.data) {
          throw new Error(json.error || "Không tải được sản phẩm");
        }
        return json.data;
      })
      .then((rows) => {
        if (cancelled) return;
        const next = new Map<string, HomeTemplateItem>();
        for (const row of rows) {
          const item = mapProductDtoToHomeTemplateItem(row);
          next.set(item.id, item);
        }
        setMap(next);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setMap(new Map());
          setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { map, loading, error };
}

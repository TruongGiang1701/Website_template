import { notFound } from "next/navigation";
import { TemplateDetailPage } from "@/features/marketing/pages/template-detail/TemplateDetailPage";
import { mapProductDtoToHomeTemplateItem } from "@/lib/catalog/map-product-to-home-item";
import { getBackendUrlForServer } from "@/lib/server-backend-url";
import type { ProductDetailDTO, ProductListItemDTO } from "@/types/products";

export const dynamic = "force-dynamic";

type Params = {
  slug: string;
};

type DetailJson = { ok: boolean; data?: ProductDetailDTO; error?: string };
type RelatedJson = { ok: boolean; data?: ProductListItemDTO[]; error?: string };

export default async function TemplateDetailRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug ?? "").trim();
  if (!decoded) notFound();

  const base = getBackendUrlForServer();
  const detailRes = await fetch(
    `${base}/api/products/${encodeURIComponent(decoded)}`,
    { cache: "no-store" },
  );
  const detailJson = (await detailRes.json()) as DetailJson;
  if (!detailRes.ok || !detailJson.ok || !detailJson.data) notFound();

  const detail = detailJson.data;
  const item = mapProductDtoToHomeTemplateItem(detail);
  const galleryUrls =
    detail.images.length > 0
      ? detail.images.map((i) => i.url).slice(0, 6)
      : [item.image];

  const relRes = await fetch(
    `${base}/api/products/${encodeURIComponent(decoded)}/related?limit=12`,
    { cache: "no-store" },
  );
  const relJson = (await relRes.json()) as RelatedJson;
  const relatedDtos = relRes.ok && relJson.ok && relJson.data ? relJson.data : [];
  const relatedItems = relatedDtos.map(mapProductDtoToHomeTemplateItem);

  return (
    <TemplateDetailPage item={item} galleryUrls={galleryUrls} relatedItems={relatedItems} />
  );
}

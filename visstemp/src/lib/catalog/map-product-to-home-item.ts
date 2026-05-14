import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import type { ProductListItemDTO } from "@/types/products";

const KNOWN_GROUPS: readonly HomeTemplateItem["group"][] = [
  "Thời trang",
  "Nhà hàng",
  "Làm đẹp",
  "Giáo dục",
  "Doanh nghiệp",
  "Công nghệ",
] as const;

/** Map DTO API → `HomeTemplateItem` (card + đường dẫn chi tiết). */
export function mapProductDtoToHomeTemplateItem(
  dto: ProductListItemDTO,
): HomeTemplateItem {
  const group = KNOWN_GROUPS.includes(dto.group as HomeTemplateItem["group"])
    ? (dto.group as HomeTemplateItem["group"])
    : "Doanh nghiệp";

  return {
    id: dto.id,
    title: dto.title,
    image: dto.image,
    href: dto.href,
    tags: dto.tags.length > 0 ? dto.tags : ["Website"],
    price: dto.price,
    group,
    featured: dto.featured,
  };
}

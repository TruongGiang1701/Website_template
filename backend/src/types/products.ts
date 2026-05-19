export type ProductListItemDTO = {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  group: string;
  category_id?: string | null;
  category_name?: string | null;
  tags: string[];
  image: string;
  href: string;
  featured: boolean;
  price_vnd: number;
  /** Định dạng giống demo: `12.000.000 VND` */
  price: string;
  status: "draft" | "active" | "archived";
  deleted_at: string | null;
};

export type ProductImageDTO = {
  url: string;
  alt: string | null;
  sort_order: number;
};

export type ProductDetailDTO = ProductListItemDTO & {
  description: string | null;
  try_url: string | null;
  images: ProductImageDTO[];
};


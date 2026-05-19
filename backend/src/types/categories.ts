export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminCategoryListItemDTO = CategoryDTO & {
  product_count: number;
};

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  sort_order?: number;
  is_active?: boolean;
  parent_id?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

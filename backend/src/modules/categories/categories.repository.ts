import { query } from "@/lib/db";
import type {
  AdminCategoryListItemDTO,
  CategoryDTO,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/categories";

function mapRow(row: any): CategoryDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sort_order: row.sort_order,
    is_active: row.is_active,
    parent_id: row.parent_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCategories(): Promise<CategoryDTO[]> {
  const res = await query(`
    SELECT * FROM categories
    ORDER BY sort_order ASC, name ASC
  `);
  return res.rows.map(mapRow);
}

export async function listCategoriesForAdmin(): Promise<AdminCategoryListItemDTO[]> {
  const res = await query(`
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
    FROM categories c
    ORDER BY c.sort_order ASC, c.name ASC
  `);
  return res.rows.map((row) => ({
    ...mapRow(row),
    product_count: parseInt(row.product_count, 10),
  }));
}

export async function getCategoryById(id: string): Promise<CategoryDTO | null> {
  const res = await query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryDTO> {
  const slug = input.slug || input.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const res = await query(
    `
    INSERT INTO categories (name, slug, sort_order, is_active, parent_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [input.name, slug, input.sort_order || 0, input.is_active ?? true, input.parent_id || null]
  );
  return mapRow(res.rows[0]);
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryDTO> {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (input.name !== undefined) {
    fields.push(`name = $${i++}`);
    values.push(input.name);
  }
  if (input.slug !== undefined) {
    fields.push(`slug = $${i++}`);
    values.push(input.slug);
  }
  if (input.sort_order !== undefined) {
    fields.push(`sort_order = $${i++}`);
    values.push(input.sort_order);
  }
  if (input.is_active !== undefined) {
    fields.push(`is_active = $${i++}`);
    values.push(input.is_active);
  }
  if (input.parent_id !== undefined) {
    fields.push(`parent_id = $${i++}`);
    values.push(input.parent_id);
  }

  if (fields.length === 0) return (await getCategoryById(id))!;

  values.push(id);
  const res = await query(
    `
    UPDATE categories
    SET ${fields.join(", ")}, updated_at = now()
    WHERE id = $${i}
    RETURNING *
    `,
    values
  );
  return mapRow(res.rows[0]);
}

export async function deleteCategory(id: string): Promise<void> {
  await query(`DELETE FROM categories WHERE id = $1`, [id]);
}

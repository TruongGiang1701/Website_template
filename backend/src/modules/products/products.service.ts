import { Injectable } from "@nestjs/common";
import {
  createProduct,
  softDeleteProductBySlug,
  updateProductBySlug,
} from "./products.mutations";
import {
  countProducts,
  getProductDetailBySlug,
  getPublicProductCatalogStats,
  listProducts,
  listRelatedPublicProducts,
  type ListProductsFilter,
} from "./products.repository";

@Injectable()
export class ProductsService {
  count(filters: ListProductsFilter) {
    return countProducts(filters);
  }

  list(filters: ListProductsFilter, limit: number, offset: number) {
    return listProducts(filters, limit, offset);
  }

  meta() {
    return getPublicProductCatalogStats();
  }

  detail(slug: string) {
    return getProductDetailBySlug(slug, "public");
  }

  related(excludeSlug: string, groupName: string, limit: number) {
    return listRelatedPublicProducts(excludeSlug, groupName, limit);
  }

  create(raw: Record<string, unknown>) {
    return createProduct(raw);
  }

  update(slug: string, raw: Record<string, unknown>) {
    return updateProductBySlug(slug, raw);
  }

  softDelete(slug: string) {
    return softDeleteProductBySlug(slug);
  }
}

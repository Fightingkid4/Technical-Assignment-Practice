import type { Product } from "./product.types";

export interface ProductProvider {
  listProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
}
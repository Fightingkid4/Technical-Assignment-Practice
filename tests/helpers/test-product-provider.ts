import { AppError } from "../../src/errors/app-error";
import type { ProductProvider } from "../../src/products/product-provider";
import type { Product } from "../../src/products/product.types";

export class TestProductProvider implements ProductProvider {
  constructor(
    private readonly products: Product[] = [],
    private readonly failureMode?: "list" | "item"
  ) {}

  async listProducts(): Promise<Product[]> {
    if (this.failureMode === "list") {
      throw new AppError(502, "Unable to fetch products from upstream provider");
    }

    return this.products;
  }

  async getProductById(id: number): Promise<Product | null> {
    if (this.failureMode === "item") {
      throw new AppError(502, "Unable to fetch product from upstream provider");
    }

    return this.products.find((product) => product.id === id) ?? null;
  }
}
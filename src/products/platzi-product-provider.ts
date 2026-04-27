import { z } from "zod";

import { AppError } from "../errors/app-error";
import type { ProductProvider } from "./product-provider";
import type { Product } from "./product.types";

const platziProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    image: z.string().url(),
    slug: z.string()
  }),
  images: z.array(z.string().url())
});

const platziProductArraySchema = z.array(platziProductSchema);

const mapProduct = (product: z.infer<typeof platziProductSchema>): Product => ({
  id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category.name,
  image: product.images[0] ?? product.category.image
});

export class PlatziProductProvider implements ProductProvider {
    constructor(private readonly baseUrl = "https://api.escuelajs.co/api/v1") {}

  async listProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`);

    if (!response.ok) {
      throw new AppError(502, "Unable to fetch products from the Platzi API");
    }

    const data = await response.json();
    return platziProductArraySchema.parse(data).map(mapProduct);
  }
  async getProductById(id: number): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new AppError(502, "Unable to fetch product from the Platzi API");
    }

    const data = await response.json();

    if (data === null || (typeof data === "object" && data !== null && !("id" in data))) {
      return null;
    }

    return mapProduct(platziProductSchema.parse(data));
  }
}
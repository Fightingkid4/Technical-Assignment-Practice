import { createApp } from "../../src/app";
import type { Product } from "../../src/products/product.types";
import { InMemoryWatchlistRepository } from "./in-memory-repositories";
import { TestProductProvider } from "./test-product-provider";

export const createTestApp = (options?: {
  products?: Product[];
  productFailureMode?: "list" | "item";
}) => {
  const repositories = {
    watchlistRepository: new InMemoryWatchlistRepository()
  };
  const productProvider = new TestProductProvider(
    options?.products ?? [],
    options?.productFailureMode
  );

  const app = createApp({
    ...repositories,
    productProvider
  });

  return {
    app,
    repositories,
    productProvider
  };
};
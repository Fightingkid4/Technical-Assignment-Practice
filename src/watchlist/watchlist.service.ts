import { AppError } from "../errors/app-error";
import type { ProductProvider } from "../products/product-provider";
import type { WatchlistRepository } from "../repositories/interfaces";

export class WatchlistService {
  constructor(
    private readonly watchlistRepository: WatchlistRepository,
    private readonly productProvider: ProductProvider
  ) {}

  list() {
    return this.watchlistRepository.list();
  }
  async add(externalProductId: number) {
    const existingItem = await this.watchlistRepository.findByProductId(externalProductId);

    if (existingItem) {
      throw new AppError(409, "Product is already in the watchlist");
    }

    const product = await this.productProvider.getProductById(externalProductId);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    return this.watchlistRepository.create({
      externalProductId,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category
    });
  }

  async remove(externalProductId: number) {
    const deleted = await this.watchlistRepository.deleteByProductId(externalProductId);

    if (!deleted) {
      throw new AppError(404, "Watchlist item not found");
    }
  }
}
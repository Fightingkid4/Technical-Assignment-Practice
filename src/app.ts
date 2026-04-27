import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { WatchlistRepository } from "./repositories/interfaces";
import { WatchlistService } from "./watchlist/watchlist.service";
import { ProductProvider } from "./products/product-provider";
import { createProductsRouter } from "./products/product.routes";
import { createWatchlistRouter } from "./watchlist/watchlist.routes";

export interface AppDependencies {
  watchlistRepository: WatchlistRepository;
  productProvider: ProductProvider;
}

export const createApp = (dependencies: AppDependencies) => {
  const app = express();
  const watchlistService = new WatchlistService(
    dependencies.watchlistRepository,
    dependencies.productProvider
  );

  app.use(express.json());

  app.use("/products", createProductsRouter(dependencies.productProvider));
  app.use("/watchlist", createWatchlistRouter(watchlistService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
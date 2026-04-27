import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { WatchlistRepository } from "./repositories/interfaces";

export interface AppDependencies {
  watchlistRepository: WatchlistRepository;
}

export const createApp = (dependencies: AppDependencies) => {
  const app = express();
const watchlistService = new WatchlistService(
    dependencies.watchlistRepository
  );
  app.use(express.json());
app.use("/test", (req, res) => {
  res.json({ message: "Hello, World!" });
});
app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
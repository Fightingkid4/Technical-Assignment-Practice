import { createApp } from "./app";
import { loadConfig } from "./config/env";
import { pool } from "./lib/db";
import { PlatziProductProvider } from "./products/platzi-product-provider";
import { SqlWatchlistRepository } from "./repositories/sql-repositories";

const config = loadConfig();

const app = createApp({
  watchlistRepository: new SqlWatchlistRepository(pool),
  productProvider: new PlatziProductProvider()
});

const server = app.listen(config.PORT, () => {
  console.log(`Watchlist API listening on port ${config.PORT}`);
});

const shutdown = async () => {
  await pool.end();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
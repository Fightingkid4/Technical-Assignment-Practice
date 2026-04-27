import { createApp } from "./app";
import { loadConfig } from "./config/env";
const config = loadConfig();
const app = createApp()
const server = app.listen(config.PORT, () => {
  console.log(`Watchlist API listening on port ${config.PORT}`);
});
const shutdown = async () => {
    server.close(() => process.exit(0));
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
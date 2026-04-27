import { createApp } from "./app";
import { loadConfig } from "./config/env";
import { pool } from "./lib/db";
const config = loadConfig();
const app = createApp()
const server = app.listen(config.PORT, () => {
  console.log(`Watchlist API listening on port ${config.PORT}`);
});
const shutdown = async () => {
    await pool.end();
    server.close(() => process.exit(0));
};

process.on("SIGINT", () => {
    console.log("Received SIGINT, shutting down gracefully...");
  void shutdown();
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM, shutting down gracefully...");
  void shutdown();
});
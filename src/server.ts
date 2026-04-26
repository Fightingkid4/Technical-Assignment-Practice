import { createApp } from "./app";
const app = createApp()
const server = app.listen(3000, () => {
  console.log(`Watchlist API listening on port ${3000}`);
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
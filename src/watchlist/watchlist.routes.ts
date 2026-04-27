import { Router } from "express";

import { validate } from "../middleware/validate";
import type { WatchlistService } from "./watchlist.service";
import { addWatchlistItemSchema, watchlistParamsSchema } from "./watchlist.schemas";

export const createWatchlistRouter = (watchlistService: WatchlistService) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    const items = await watchlistService.list();
    res.json({ data: items });
  });

  router.post("/", validate(addWatchlistItemSchema), async (req, res) => {
    const item = await watchlistService.add(req.body.productId);
    res.status(201).json({ data: item });
  });

  router.delete("/:productId", validate(watchlistParamsSchema, "params"), async (req, res) => {
    await watchlistService.remove(Number(req.params.productId));
    res.status(204).send();
  });

  return router;
};
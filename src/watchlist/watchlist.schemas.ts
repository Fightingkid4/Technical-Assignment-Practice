import { z } from "zod";

export const addWatchlistItemSchema = z.object({
  productId: z.coerce.number().int().positive()
});

export const watchlistParamsSchema = z.object({
  productId: z.coerce.number().int().positive()
});
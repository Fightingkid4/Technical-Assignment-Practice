import { Router } from "express";
import { z } from "zod";

import { AppError } from "../errors/app-error";
import { validate } from "../middleware/validate";
import type { ProductProvider } from "./product-provider";

const productIdParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const createProductsRouter = (productProvider: ProductProvider) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    const products = await productProvider.listProducts();
    res.json({ data: products });
  });

  router.get("/:id", validate(productIdParamsSchema, "params"), async (req, res) => {
    const product = await productProvider.getProductById(Number(req.params.id));

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    res.json({ data: product });
  });

  return router;
};
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";

type RequestTarget = "body" | "params" | "query";

export const validate =
  <T extends ZodTypeAny>(schema: T, target: RequestTarget = "body"): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[target]);
    (req as unknown as Record<string, unknown>)[target] = parsed;
    next();
  };
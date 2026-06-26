import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationSource = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, source: ValidationSource = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[source]);

      if (source === "body") {
        req.body = parsed;
      }

      if (source === "query") {
        req.query = parsed as Request["query"];
      }

      if (source === "params") {
        req.params = parsed as Request["params"];
      }

      next();
    } catch (error) {
      next(error);
    }
  };

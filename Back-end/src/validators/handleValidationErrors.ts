import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({
        field: e.type === "field" ? e.path : undefined,
        message: e.msg,
      })),
    });
  }

  next();
};
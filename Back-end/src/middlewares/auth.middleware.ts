import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../interfaces/respons.interface.js";
import { config } from "../config/env.js";

const fail = (res: Response<ApiResponse>, message: string) =>
    res.status(401).json({ status: "fail", message });

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.length > 0;

export const authenticate = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return fail(res, "authorization header is required");
    }

    const [scheme, token, ...extra] = authHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
        return fail(res, "authorization header must be: Bearer <token>");
    }

    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return fail(res, "expired token");
        }
        return fail(res, "invalid token");
    }

    if (typeof decoded === "string") {
        return fail(res, "invalid token");
    }

    const { id, email, username, type, exp } = decoded;

    if (
        type !== "access" ||
        typeof exp !== "number" ||
        !isNonEmptyString(id) ||
        !isNonEmptyString(email) ||
        !isNonEmptyString(username)
    ) {
        return fail(res, "invalid token");
    }

    req.user = { id, email, username };
    next();
};
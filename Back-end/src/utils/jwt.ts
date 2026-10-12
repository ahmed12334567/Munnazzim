import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export interface AccessTokenInput {
    id: string;
    email: string;
    username: string;
}

export const generateToken = (user: AccessTokenInput): string => {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username, type: "access" },
        config.jwtSecret,
        { algorithm: "HS256", expiresIn: config.accessTokenExpiresIn }
    );
};

export const generateRefreshToken = (user: { id: string }): string => {
    return jwt.sign(
        { id: user.id, type: "refresh" },
        config.jwtRefreshSecret,
        { algorithm: "HS256", expiresIn: config.refreshTokenExpiresIn }
    );
};

export const verifyRefreshToken = (token: string): { id: string } => {
    const decoded = jwt.verify(token, config.jwtRefreshSecret, { algorithms: ["HS256"] });

    if (
        typeof decoded === "string" ||
        decoded.type !== "refresh" ||
        typeof decoded.id !== "string" ||
        decoded.id.length === 0
    ) {
        throw new Error("invalid refresh token");
    }

    return { id: decoded.id };
};
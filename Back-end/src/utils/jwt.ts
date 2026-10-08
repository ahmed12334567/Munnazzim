import jwt from "jsonwebtoken"
import type { JwtPayload, JwtRefrashPayload } from "../types/jwtPayload.types.js"
import dotenv from "dotenv"
dotenv.config()

export const generateToken = (data: JwtPayload): string => {
    return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "15m" });
};
export const generateRefreshToken = (data: JwtRefrashPayload): string => {
    return jwt.sign(data, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};


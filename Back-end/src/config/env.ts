import dotenv from "dotenv";

dotenv.config();

const required = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const jwtSecret = required("JWT_SECRET");
const jwtRefreshSecret = required("JWT_REFRESH_SECRET");

if (jwtSecret === jwtRefreshSecret) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be different");
}

export const config = {
    jwtSecret,
    jwtRefreshSecret,
    accessTokenExpiresIn: "15m",
    refreshTokenExpiresIn: "7d",
} as const;
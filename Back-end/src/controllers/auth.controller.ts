import type { Request, Response } from 'express';
import { ApiResponse } from '../types/respons.types.js';
import { createUser, loginUser } from '../services/auth.service.js';
import userRepo from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/jwt.js";
import dotenv from "dotenv"
dotenv.config()

export const register = async (req: Request, res: Response<ApiResponse>) => {

    const result = await createUser(req.body);

    if (result.status === "fail") {
        if (result.code === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                status: "fail",
                message: "Invalid email or password"
            });
        }
    }
    const refreshToken = generateRefreshToken({
        id: result.data!.id
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(result)
}

export const login = async (req: Request, res: Response<ApiResponse>) => {
    const result = await loginUser(req.body)

    if (result.status === "fail" || result.code) {
        if (result.code === "EMAIL_NOT_FOUND") {
            return res.status(404).json({
                status: "fail",
                message: "email is not found"
            })
        }
        else if (result.code === "WORNG_PASSWORD") {
            return res.status(409).json({
                status: "fail",
                message: "worng password"
            })
        }
    }

    const refreshToken = generateRefreshToken({
        id: result.data!.id
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(result)
}

export const refreshToken = async (req: Request, res: Response<ApiResponse>) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(400).json({
            status: "fail",
            message: "refresh token is required"
        })
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
    )

    if (typeof decoded === 'string' || !decoded.id) {
        return res.status(401).json({
            status: "fail",
            message: "Invalid refresh token"
        })
    }

    const user = await userRepo.findUserByID(decoded.id);

    if (!user) {
        return res.status(401).json({
            status: "fail",
            message: "User no longer exists"
        });
    }

    const accessToken = generateToken({
        id: user.id,
        username: user.username,
        email: user.email
    })

    const refreshToken = generateRefreshToken({
        id: user.id
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        status: "success",
        message: "refresh token is created successfully",
        data: {
            accessToken
        }
    })

}

export const logout = async (req: Request, res: Response<ApiResponse>) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(400).json({
                status: "fail",
                message: "refresh token is required"
            })
        }
        
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Something went wrong"
        });
    }
}
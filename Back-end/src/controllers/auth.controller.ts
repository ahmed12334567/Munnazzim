import type { Request, Response } from 'express';
import { ApiResponse } from '../types/respons.types.js';
import { createUser, loginUser } from '../services/auth.service.js';
import { generateRefreshToken } from "../utils/jwt.js";

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
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(result)
}

export const login = async (req: Request, res: Response<ApiResponse>) => {
    const result = await loginUser(req.body)

    if(result.status === "fail" || result.code){
        if(result.code ===  "EMAIL_NOT_FOUND"){
            return res.status(404).json({
                status: "fail",
                message: "email is not found"
            })
        }
        else if(result.code ===  "WORNG_PASSWORD"){
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
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(result)
}
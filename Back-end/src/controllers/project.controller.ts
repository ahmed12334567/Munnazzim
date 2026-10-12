import type {Request, Response } from 'express';
import { ApiResponse } from '../interfaces/respons.interface.js';
import { createProject } from "../services/project.service.js"


export const addProject = async (req: Request, res: Response<ApiResponse>) => {
    const userId = req.user?.id

    const result = await createProject(req.body, userId!);

    if (!result) {
        return res.status(500).json({
            status: "fail",
            message: "Server Error"
        })
    }

    return res.status(201).json({
        status: "success",
        message: "created project with successfully",
        data: {
            result
        }
    })
}
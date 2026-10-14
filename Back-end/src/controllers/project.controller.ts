import type {Request, Response } from 'express';
import { ApiResponse } from '../interfaces/respons.interface.js';
import { createProject, getUserProjects } from "../services/project.service.js"


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

export const project = async (req: Request, res: Response<ApiResponse>) =>{

    const userId = req.user?.id as string

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit

    const projects = await getUserProjects(userId, limit, offset);

        return res.status(200).json({
        status: "success",
        message: "projects fetched successfully",
        data: { projects },
    });
}
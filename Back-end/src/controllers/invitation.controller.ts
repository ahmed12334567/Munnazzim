import type { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/respons.interface.js';
import { createInvitation } from "../services/invitation.service.js";
import { Invitation } from '../interfaces/invitation.interface.js';


export const addInvitation = async (req: Request, res: Response<ApiResponse>) => {
    const userId = req.user?.id as string
    const userEmail = req.user?.email as string
    const projectId = req.params.project_id as string
    const { email, role } = req.body

    const invitationData: Invitation = {
        projectId: projectId,
        invitedBy: userId,
        email: email,
        role: role
    }

    const result = await createInvitation(invitationData, userId, userEmail);

    if (result.message) {
        return res.status(result.code).json({
            status: result.status,
            message: result.message
        })
    }

    return res.status(201).json({
        status: "success",
        message: "The invitation has been sent successfully; awaiting the user's response."
    })
}
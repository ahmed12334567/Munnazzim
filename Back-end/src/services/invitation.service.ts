import { Invitation } from "../interfaces/invitation.interface.js";
import invitationRepo from "../repositories/invitation.repositroy.js";
import userRepo from "../repositories/user.repository.js";
import projectRepo from "../repositories/project.repositroy.js";


export const createInvitation = async (data: Invitation, userId: string, userEmail: string) => {

    const normalizeEmail = (email: string) => email.trim().toLowerCase();

    if(normalizeEmail(data.email) === normalizeEmail(userEmail)){
        return {
            status: "fail",
            message: "cannot send invitation to yourself!",
            code: 400
        }
    }

    const isAdmin = await invitationRepo.checkAdmin(data.projectId, userId)

    if (!isAdmin) {
        return {
            status: "fail",
            message: "can only admins or owner send invitations",
            code: 403
        }
    }

    const exsitsEmail = await userRepo.findUserByEmail(data.email);

    if (!exsitsEmail) {
        return {
            status: "fail",
            message: "email not found",
            code: 404
        }
    }

    const [isMember, hasPendingInvitation] = await Promise.all([
        projectRepo.isProjectMember(data.projectId, exsitsEmail.id),
        invitationRepo.hasPendingInvitation(data.projectId, data.email),
    ]);

    if(isMember){
        return {
            status: "fail",
            message: "the user is already member in project",
            code: 409
        }
    }


    if (hasPendingInvitation) {
        return {
            status: "fail",
            message: "the invitation already sended",
            code: 409
        }
    }

    const invitation = await invitationRepo.createInvitation(data);

    if (!invitation) {
        return {
            status: "fail",
            message: "Something went error",
            code: 500
        }
    }

    return invitation;
}
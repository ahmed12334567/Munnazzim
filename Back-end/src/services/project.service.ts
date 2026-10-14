import pool from "../db/pool.js";
import projectRepo from "../repositories/project.repositroy.js";
import { Member } from "../interfaces/member.interface.js";
import type { Project } from "../interfaces/project.interface.js";

export const createProject = async (data: Project, owner_id: string) => {
    const client = await pool.connect();
    let destroyClient = false;
    const id = owner_id
    try {

        await client.query("BEGIN");

        const projectData: Project = {
            name: data.name,
            description: data.description,
            owner_id: id
        }

        const project = await projectRepo.createProject(client, projectData);

        const memberData: Member = {
            projectId: project.id,
            userId: id,
            role: "owner"
        }

        const member = await projectRepo.addMember(client, memberData)

        await client.query("COMMIT")

        return {
            project_id: project.id,
            project_name: project.name,
            project_description: project.description,
            members: [{ user_id: id, role: member.role }]
        }

    } catch (err) {
        try {
            await client.query("ROLLBACK");

        } catch (rollbackErr) {
            destroyClient = true;
            console.error("ROLLBACK failed:", rollbackErr);
        }
        throw err;
    }
    finally {
        client.release(destroyClient);
    }
}

export const getUserProjects = async (userId: string, limit: number,
    offset: number): Promise<Project[]> => {

    return projectRepo.selectUserProjects(userId, limit, offset)
}
import pool from "../db/pool.js";
import { Member } from "../interfaces/member.interface.js";
import { Project } from "../interfaces/project.interface.js";
import { PoolClient } from "pg"

const project = {
    createProject: async (client: PoolClient, data: Project) => {
        const query = `INSERT INTO projects(name, description, owner_id)
        VALUES($1, $2, $3)
        RETURNING *`
        const values = [data.name, data.description, data.owner_id]
        const result = await client.query(query, values)
        return result.rows[0]
    },
    addMember: async (client: PoolClient, data: Member) => {
        const query = `INSERT INTO project_members(project_id, user_id, role)
        VALUES($1, $2, $3)
        RETURNING *`
        const values = [data.projectId, data.userId, data.role]
        const result = await client.query(query, values);
        return result.rows[0]
    },
    selectUserProjects: async (userId: string, limit: number,
        offset: number): Promise<Project[]> => {
        const query = `SELECT p.id, p.name, p.owner_id, p.created_at
            FROM projects p WHERE p.owner_id = $1
            OR EXISTS (
            SELECT 1
            FROM project_members pm
            WHERE pm.project_id = p.id
            AND pm.user_id = $1
            )
            ORDER BY p.created_at DESC, p.id DESC
            LIMIT $2 OFFSET $3`
        const values = [userId, limit, offset]
        const result = await pool.query(query, values)
        return result.rows
    }
}

export default project;
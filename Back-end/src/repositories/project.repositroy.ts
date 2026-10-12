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
    }
}

export default project;
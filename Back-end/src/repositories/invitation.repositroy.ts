import pool from "../db/pool.js";
import { Invitation } from "../interfaces/invitation.interface.js";

const invitation = {
    createInvitation: async (data: Invitation) => {
        const query = `INSERT INTO project_invitations(project_id, invited_by, 
        email, role, expires_at) VALUES($1, $2, $3, $4, NOW() + INTERVAL '7 days')
        RETURNING *;`
        const values = [data.projectId, data.invitedBy, data.email, data.role];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    checkAdmin: async (projectId: string, adminId: string) => {
        const query = `SELECT 1 FROM project_members 
        WHERE project_id = $1 AND user_id = $2 AND role IN ('admin', 'owner')`;
        const values = [projectId, adminId]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    hasPendingInvitation: async(projectId: string, email: string) =>{
        const query = `SELECT 1 FROM project_invitations
        WHERE project_id = $1 AND email = $2 AND status = 'pending'`
        const values = [projectId, email]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
}

export default invitation;
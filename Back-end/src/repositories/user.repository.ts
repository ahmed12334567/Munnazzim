import pool from "../db/pool.js";
import { User } from "../types/user.types.js";
const user = {
    createUser: async(data: User) => {
        const query = `INSERT INTO users(username, email, password)
        VALUES($1, $2, $3)
        RETURNING *`
        const values = [data.username, data.email, data.password]
        const result = await pool.query(query, values)
        return result.rows[0]
    },
    findUserByEmail: async(email: string) =>{
        const query = `SELECT * FROM users 
        WHERE email = $1`
        const value = [email]
        const result = await pool.query(query, value)
        return result.rows[0]
    }
}

export default user
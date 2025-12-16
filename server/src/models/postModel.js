import { db } from "../db/db.js"

export const Post = {
    async create(username, message) {
        const sqlQuery = `
            INSERT INTO posts (username, message)
            VALUES (?, ?)
        `

        const [result] = await db.execute(sqlQuery, [username, message])

        return {
            id: result.insertId,
            username,
            message,
            createdAt: new Date().toISOString()
        }
    },
    async get({ limit, offset }) {
        // Ensure that limit and offset are numbers, not NaN
        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new Error("Invalid pagination values")
        }
        
        const sqlQuery = `
            SELECT 
                id,
                username,
                message, 
                created_at 
            FROM posts
            ORDER BY created_at DESC 
            LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `

        const [rows] = await db.execute(sqlQuery)

        return rows
    }
}
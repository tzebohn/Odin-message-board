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
}
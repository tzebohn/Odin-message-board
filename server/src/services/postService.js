import { Post } from "../models/postModel.js";
import { censorText } from "../utils/profanity.js";

/**
 * 
 * @param {*} username  - The username to insert.
 * @param {*} message   - The message to insert.
 */
export async function createPostService (username, message) {
    // Save original to DB
    const saved = await Post.create(username, message)
    return saved
}

export async function getPosts ({ page, limit }) {
    const offset = (page - 1) * limit
    const rows = await Post.get({ limit, offset })

    return rows.map(row => ({
        id: row.id,
        username: row.username,
        message: censorText(row.message),
        createdAt: row.created_at
    }))
}
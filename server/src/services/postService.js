import { Post } from "../models/postModel.js";

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
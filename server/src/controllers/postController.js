import { createPostService, getPosts } from "../services/postService.js"
import { censorText } from "../utils/profanity.js"

async function getAllPosts (req, res, next) {
    
    try {
        let page = parseInt(req.query.page, 10)
        let limit = parseInt(req.query.limit, 10)

        if (Number.isNaN(page) || page < 1) page = 1                    // Default page is 1
        if (Number.isNaN(limit) || limit < 1 || limit > 100) limit = 25 // Default limit is 25

        const posts = await getPosts({ page, limit })
        res.json(posts)
    } catch (err) {
        next(err)
    }
}

async function createPost (req, res) {
    try {
        const { username, message } = req.body
        
        // 1. Save ORIGINAL to DB
        const saved = await createPostService(username, message)

        // 2. Censor message ONLY for client display
        const censored = {
            ...saved,
            message: censorText(saved.message)
        }
        return res.status(201).json(censored)
    }
    catch (err) {
        console.error("Create post error:", err)
        res.status(500).json({ error: "Server error creating post" })
    }
}

export default {
    getAllPosts,
    createPost 
}
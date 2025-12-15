import { createPostService } from "../services/postService.js"
import { censorText } from "../utils/profanity.js"

function getAllPosts () {
    console.log("Getting all posts")
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
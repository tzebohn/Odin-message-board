import { Router } from "express";
import { getAllPosts, createPost } from "../controllers/postController.js";

//  Create router object
const router = Router()

router.get('/get-posts', getAllPosts)   // GET /posts route
router.post('/create-post', createPost)   // POST /posts route

export default router;
import { Router } from "express";
import postController from "../controllers/postController.js";
import { createPostValidator } from "../validators/createPostValidator.js";
import { handleValidationErrors } from "../validators/handleValidationErrors.js";
import { getPostsValidator } from "../validators/postValidator.js";

//  Create router object
const router = Router()

router.get(
    '/get-posts', 
    getPostsValidator,
    handleValidationErrors,
    postController.getAllPosts  // controller
)

// POST /posts route
router.post(
    '/create-post',             // Path
    createPostValidator,        // Validate form data
    handleValidationErrors,     // Stop request if there are errors
    postController.createPost   // controller runs only if valid
)

export default router;
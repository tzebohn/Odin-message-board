import { body } from "express-validator"
import { containsProfanity } from "../utils/profanity.js"

export const createPostValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")

        // Character validations
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username may only contain letters, numbers, and underscores")

        // Length rule
        .isLength({ min:3, max: 20})
        .withMessage("Username must be between 3 and 20 characters")

        // Profanity check
        .custom((value) => {
            if (containsProfanity(value)) {
                throw new Error("Username contains inappropriate language")
            }
            return true
        }),
 
    body("message")
        .trim()
        .notEmpty().withMessage("Message is required")
        .isLength({ max: 500 }).withMessage("Message is too long")
]
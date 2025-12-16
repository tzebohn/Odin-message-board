import { query } from "express-validator"

/**
 * Validates the response headers from GET request.
 * Prepares for future pagination.
 */
export const getPostsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1})
        .withMessage("Page must be a positive number"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 25})
        .withMessage("Limit must be between 1 and 25")
]
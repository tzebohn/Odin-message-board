import { validationResult } from "express-validator";

export function handleValidationErrors(req, res, next) {

    // Get the errors
    const errors = validationResult(req)

    // Check if there are errors
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }
    
    // No errors
    next()
}
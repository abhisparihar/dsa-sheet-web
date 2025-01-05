const Joi = require('joi');

// Regular expression for validating MongoDB ObjectId
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

// Update user schema
const updateUserSchema = Joi.object({
    subtopicId: Joi.string().regex(objectIdRegex).required().messages({
        "string.empty": "Subtopic ID is required.",
        "any.required": "Subtopic ID is mandatory.",
        "string.pattern.base": "Subtopic ID must be a valid ObjectId.",
    }),
});

// Login schema with custom error messages
const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            "string.email": "Please provide a valid email address.",
            "string.empty": "Email is required.",
            "any.required": "Email is mandatory."
        }),
        password: Joi.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long.",
            "string.empty": "Password is required.",
            "any.required": "Password is mandatory."
        }),
    }),
};

module.exports = {
    updateUserSchema,
    login
};

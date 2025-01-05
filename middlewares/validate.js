const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        console.log("🚀 ~ errors:", errors)
        return res.status(400).json({ message: 'Validation Error', errors });
    }

    next();
};

module.exports = validate;

const AppError = require("../common/errors/appError");

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

    if (!result.success) {
        // Customize Zod's issues into a compact, predictable API response.
        const issues = result.error.issues.map((issue) => ({
            field: issue.path.slice(1).join(".") || "body",
            message: issue.message,
            code: issue.code
        }));
        return next(new AppError("Validation failed", 400, issues));
    }

    req.body = result.data.body;
    next();
};

module.exports = validate;

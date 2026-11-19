const { z } = require("zod");

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128);

const registerSchema = z.object({
    body: z.object({
        userName: z.string().trim().min(2).max(50),
        email,
        password
    }).strict()
});

const loginSchema = z.object({
    body: z.object({ email, password: z.string().min(1).max(128) }).strict()
});

const emailSchema = z.object({ body: z.object({ email }).strict() });
const verifySchema = z.object({
    body: z.object({ email, code: z.string().regex(/^\d{6}$/, "Code must contain exactly 6 digits") }).strict()
});
const resetPasswordSchema = z.object({
    body: z.object({
        email,
        code: z.string().regex(/^\d{6}$/, "Code must contain exactly 6 digits"),
        newPassword: password
    }).strict()
});
const googleSchema = z.object({
    body: z.object({ idToken: z.string().min(1, "Google ID token is required") }).strict()
});

module.exports = { registerSchema, loginSchema, emailSchema, verifySchema, resetPasswordSchema, googleSchema };

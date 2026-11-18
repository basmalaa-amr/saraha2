const { z } = require("zod");
const createMessageSchema = z.object({
    body: z.object({
        content: z.string().trim().min(1).max(2000),
        senderName: z.string().trim().max(80).optional()
    }).strict()
});
module.exports = { createMessageSchema };

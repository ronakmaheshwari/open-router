import z from "zod";

export const role = z.enum(["user", "assistant"])

export const messageType = z.object({
    role: role,
    content: z.string()
})

export const messageBodyType = z.object({
    model: z.string(),
    messages: z.array(messageType)
})
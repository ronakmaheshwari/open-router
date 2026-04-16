import z from "zod";

export const role = z.enum(["user", "assistant"]);
export const models = z.enum(["gemini", "openai", "anthropic"]);

export const messageSchema = z.object({
    role: role,
    content: z.string()
})

export const messageType = z.array(messageSchema)

export const messageBodyType = z.object({
    apikey: z.string(),
    model: z.string().refine((val) => val.includes("/"), {
        message: "Model must be in format 'provider/model'"
    }),
    messages: messageType
})

export type Message = z.infer<typeof messageType>;
export type messageSchemaType = z.infer<typeof messageSchema>;
export type ModelType = z.infer<typeof models>;
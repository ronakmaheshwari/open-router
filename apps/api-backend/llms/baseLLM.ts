import type { Message } from "@repo/validation";

export type LLMResponse = {
    outputTokens?: number,
    inputTokens?: number,
    completions: {
        message: {
            content: string
        }
    }[]
}

export class BaseLLM {
    static chat(model: string, message: Message): Promise<LLMResponse> {
        throw new Error("Not implemented yet");
    }
}
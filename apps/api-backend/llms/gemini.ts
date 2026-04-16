import type { Message } from "@repo/validation";
import { BaseLLM, type LLMResponse } from "./baseLLM";
import { GoogleGenAI } from "@google/genai";

const Geminikey = process.env.GOOGLE_GEMINI;
if(!Geminikey) {
    throw new Error("No Gemini key was provided")
} 

const ai = new GoogleGenAI({
    apiKey: Geminikey,
});

export class Gemini extends BaseLLM {
    static override async chat(model: string, messages: Message): Promise<LLMResponse> {
        const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: messages.map(message => ({
                    text: message.content,
                })),
        });
        return {
            outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
            inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
            completions: [
                {
                    message: {
                        content: response.text ?? ""
                    }
                }
            ]
        }
    }
}
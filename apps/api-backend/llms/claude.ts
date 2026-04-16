import type { Message } from "@repo/validation";
import { BaseLLM, type LLMResponse } from "./baseLLM";


export class Claude extends BaseLLM {
    static override async chat(model: string, messages: Message): Promise<LLMResponse> {
        // const response = await ai.models.generateContent({
        //     model: "gemini-3-flash-preview",
        //     contents: messages.map(message => ({
        //         text: message.content,
                
        //     }))
        // });
        // console.log(response.text);
            return {
                completions: [
                    {
                        message: {
                            content: ""
                        }
                    }
                ]
            }
        }
}
import { Router, type Request, type Response} from "express";
import userMiddleware from "../middleware/usermiddleware";
import { messageBodyType , type Message, type messageSchemaType, type ModelType } from "@repo/validation";
import { Gemini } from "../llms/gemini";
import { Claude } from "../llms/claude";
import db, { Prisma } from "@repo/db";

const conversationRouter: Router = Router();

conversationRouter.get("/", userMiddleware, async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: "Hii there"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal error occured",
            error: error
        })
    }
})

function parseModel(model: string) {
    const [provider, modelName] = model.split("/");

    if (!provider || !modelName) {
        throw new Error("Invalid model format. Use provider/model");
    }

    return { provider, modelName };
}

async function modelHelper(model: string, flatMessages: messageSchemaType[]) {
    const { provider, modelName } = parseModel(model);

    switch (provider) {
        case "google":
            return await Gemini.chat(modelName, flatMessages);

        case "openai":
            // return await Open.chat(modelName, flatMessages);
            break;

        case "anthropic":
            return await Claude.chat(modelName, flatMessages);

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

conversationRouter.post("/completion", userMiddleware, async(req: Request, res: Response) => {
    try {
        const user = req.userId;

        if(!user) {
            return res.status(401).json({
                message: "You are unauthorized to access this services",
                error: true
            })
        }
        const parsed = messageBodyType.safeParse(req.body);
        if(!parsed.success) {
            return res.status(409).json({
                errors: parsed.error.format(),
                message: "Validation failed",
            });
        }
        const {apikey, model, messages} = parsed.data;
        const flatMessages = messages.flat();

        const getModelResponse = await modelHelper(model, flatMessages);
        
        const createUser = await db.conversation.create({
            data: {
                    userId: user,
                    inputTokenCount: getModelResponse?.inputTokens ?? 0,
                    outputTokenCount: getModelResponse?.outputTokens ?? 0,
                    input: JSON.stringify(flatMessages),
                    output: JSON.stringify(getModelResponse?.completions.map((x) => {
                        return x.message.content
                    }) ?? [])
            }
        })


        return res.status(200).json({
            message: getModelResponse
        })
    } catch (error) {
       console.error(error);
       return res.status(500).json({
        message: "Internal error occured",
        error: error
       }) 
    }
})

export default conversationRouter;
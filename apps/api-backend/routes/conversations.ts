import { Router, type Request, type Response} from "express";
import userMiddleware from "../middleware/usermiddleware";
import { messageBodyType , type Message, type messageSchemaType, type ModelType } from "@repo/validation";
import { Gemini } from "../llms/gemini";
import { Claude } from "../llms/claude";
import db, { Prisma } from "@repo/db";

const conversationRouter: Router = Router();

conversationRouter.get("/", userMiddleware, async (req: Request, res: Response) => {
    try {
        const user = req.userId;
        const findConversation = await db.conversation.findMany({
            where: {
                userId: user
            }
        })

        if(!findConversation) {
            return res.status(404).json({
                message: "No conversations were found. Use your apikey"
            })
        }

        return res.status(200).json({
            message: "Successfully retreived the conversations",
            data: findConversation
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

async function modelHelper(provider:string, modelName: string, flatMessages: messageSchemaType[]) {
    switch (provider) {
        case "Google AI":
            return await Gemini.chat(modelName, flatMessages);

        case "Direct OpenAI":
            // return await Open.chat(modelName, flatMessages);
            break;

        case "Anthropic Direct":
            return await Claude.chat(modelName, flatMessages);

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

conversationRouter.post("/completion", userMiddleware, async(req: Request, res: Response) => {
    try {
        const user = req.userId;

        if (!user) {
            return res.status(401).json({
                message: "You are unauthorized to access this services",
                error: true
            });
        }

        const parsed = messageBodyType.safeParse(req.body);

        if (!parsed.success) {
            return res.status(409).json({
                errors: parsed.error.format(),
                message: "Validation failed",
            });
        }

        const { apikey, model, messages } = parsed.data;
        const flatMessages = messages.flat();

        const findApikey = await db.apiKey.findUnique({
            where: {
                apiKey: apikey,
                is_deleted: false,
                disabled: false
            },
            include: {
                user: {
                    include: {
                        credit: true
                    }
                }
            }
        });

        if (!findApikey) {
            return res.status(404).json({
                message: `Invalid apikey ${apikey} was provided`,
                error: true
            });
        }

        if (!findApikey.user.credit || findApikey.user.credit.amount <= 0) {
            return res.status(409).json({
                message: "You don’t have enough credits"
            });
        }

        const { provider, modelName } = parseModel(model);

        const findModel = await db.model.findFirst({
            where: { slug: modelName }
        });

        if (!findModel) {
            return res.status(404).json({
                message: `Model ${modelName} not supported`
            });
        }

        const findProvider = await db.provider.findUnique({
            where: {
                name: provider
            }
        });

        if (!findProvider) {
            return res.status(404).json({
                message: `Provider ${provider} not supported`
            });
        }
        
        const mapping = await db.modelProviderMapping.findFirst({
            where: {
                modelId: findModel.id,
                providerId: findProvider.id
            },
            include: {
                provider: true
            }
        });

        if (!mapping) {
            return res.status(404).json({
                message: `Provider ${provider} does not support model ${modelName}`
            });
        }

        const getModelResponse = await modelHelper(
            findProvider.name,
            modelName,
            flatMessages
        );

        if (!getModelResponse) {
            return res.status(500).json({
                message: "Model failed to generate response"
            });
        }

        const addConversation = await db.$transaction(async (tx: Prisma.TransactionClient) => {
            const inputCost = (getModelResponse.inputTokens ?? 0) * mapping.inputtokencost;
            const outputCost = (getModelResponse.outputTokens ?? 0) * mapping.outputtokencost;
            const totalCost = Math.ceil(inputCost + outputCost);

            const conversation = await tx.conversation.create({
                data: {
                    userId: user,
                    apiKeyId: findApikey.id,
                    modelProviderMappingId: mapping.id,
                    input: JSON.stringify(flatMessages),
                    output: JSON.stringify(
                        getModelResponse.completions.map(x => x.message.content)
                    ),
                    inputTokenCount: getModelResponse.inputTokens ?? 0,
                    outputTokenCount: getModelResponse.outputTokens ?? 0,
                }
            });
            await tx.credit.update({
                where: {
                    userId: user
                },
                data: {
                    amount: {
                        decrement: totalCost
                    }
                }
            })
            await tx.apiKey.update({
                where: {
                    id: findApikey.id
                },
                data: {
                    creditsConsumed: {
                        increment: totalCost
                    },
                    lastUsed: new Date()
                }
            })
        })

        return res.status(200).json({
            message: getModelResponse
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal error occured",
            error
        });
    }
});

export default conversationRouter;
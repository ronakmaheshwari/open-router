import db from "@repo/db";
import { ApikeyModel } from "./model";
import { status } from "elysia";
import ApikeyGenerator from "../../utils/apikeyGenerator";

abstract class Apikey {
    static async getKeys({userId}: ApikeyModel["userIdSchema"]) {
        const keys = await db.apiKey.findMany({
            where: {
                userId: userId,
                is_deleted: false
            },
            select:{
                id: true,
                name: true,
                apiKey: true,
                disabled: true,
                is_deleted: true,
                createdAt: true,
                updatedAt: true,
                lastUsed: true,
                creditsConsumed: true
            }
        })

        if(keys.length === 0 || !keys) {
            throw status(404, "No keys were found")
        }
        
        return {
            keys: keys
        }
    }

    static async createKey({userId,name}: {userId: string, name: string}) {
        const apikey = ApikeyGenerator(10);
        
        const createKey = await db.apiKey.create({
            data: {
                userId: userId,
                name: name,
                apiKey: apikey,
            }
        });

        return {
            key: createKey
        }
    }

    static async disableKey({userId,id,disable}:{userId: string, id: string, disable: boolean}) {
        const findKey = await db.apiKey.findUnique({
            where: {
                id
            }
        });

        if(!findKey){
            throw status(404,`The given apikey was not found`)
        }

        if(findKey.userId !== userId) {
            throw status(401,`The apikey doesn't belong to you`)
        }

        const updateKey = await db.apiKey.update({
            where: {
                id
            },
            data: {
                disabled: disable
            }
        })

        return {
            success: true
        }
    }

   static async getUsage({ userId }: { userId: string }) {
    const findUser = await db.user.findUnique({
        where: { id: userId },
    });

    if (!findUser) {
        throw status(404, "Invalid userId was provided");
    }

    const usage = await db.conversation.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: {
        inputTokenCount: true,
        outputTokenCount: true,
        },
    });

    const apiKeys = await db.apiKey.count({
        where: {
        userId,
        is_deleted: false,
        },
    });

    const recent = await db.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }, 
        take: 5,
        select: {
        createdAt: true,
        inputTokenCount: true,
        outputTokenCount: true,
        modelProviderMapping: {
            include: {
            model: true,
            },
        },
        },
    });

    const usageRaw = await db.conversation.findMany({
        where: { userId },
        select: {
        createdAt: true,
        inputTokenCount: true,
        outputTokenCount: true,
        },
    });

    const usageMap = new Map<string, number>();

    usageRaw.forEach((item) => {
        const date = item.createdAt.toISOString().split("T")[0]; 
        const tokens = item.inputTokenCount + item.outputTokenCount;

        usageMap.set(date, (usageMap.get(date) || 0) + tokens);
    });

    const usageByDay = Array.from(usageMap.entries()).map(
        ([date, tokens]) => ({
        date,
        tokens,
        })
    ).sort((a, b) => a.date.localeCompare(b.date)); 

    return {
        totalRequests: usage._count.id || 0,
        totalInputTokens: usage._sum.inputTokenCount || 0,
        totalOutputTokens: usage._sum.outputTokenCount || 0,
        apiKeys,

        recent: recent.map((r) => ({
        model: r.modelProviderMapping.model.name,
        tokens: r.inputTokenCount + r.outputTokenCount,
        createdAt: r.createdAt,
        })),

        usageByDay, 
    };
    }

    static async deleteKey({userId, id}: {userId: string, id: string}) {
        const findKey = await db.apiKey.findUnique({
            where: {
                id
            }
        })
        if(!findKey){
            throw status(404,`The given apikey was not found`)
        }

        if(findKey.userId !== userId) {
            throw status(401,`The apikey doesn't belong to you`)
        }

        const updateKey = await db.apiKey.update({
            where: {
                id
            },
            data: {
                is_deleted: true
            }
        })

        return {
            success: true
        }
    }
}

export default Apikey;
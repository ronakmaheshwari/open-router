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
        
        console.log(userId);

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
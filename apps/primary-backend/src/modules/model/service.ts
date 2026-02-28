import db from "@repo/db";
import { status } from "elysia";

abstract class ModelService {
    static async getModels() {
        const models = await db.model.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                company: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if(models.length === 0) {
            throw status(404 , "No models were found")
        }

        return {
            models: models
        }
    }

    static async getProviders() {
        const provider = await db.provider.findMany({
            select:{
                id: true,
                name: true,
                website: true
            },
            orderBy: {
                name: "asc"
            }
        })

        if(provider.length === 0) {
            throw status(404 , "No providers were found")
        }

        return {
            provider: provider
        }
    }

    static async getModelandProviders() {
        const allModel = await db.model.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                company: {
                    select: {
                        name: true
                    }
                },
                modelProviderMappings: {
                    select: {
                        provider: {
                            select: {
                                name: true,
                                website: true,
                            }
                        },
                        inputtokencost: true,
                        outputtokencost: true
                    }
                }
            },
            orderBy: {
                name: "asc"
            }
        })

        if(allModel.length === 0) {
            throw status(404 , "No models and providers were found")
        }

        return {
            allModel: allModel
        }
    }
}

export default ModelService;
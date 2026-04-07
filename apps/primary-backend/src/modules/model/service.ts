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

        const formatted = models.map(model => ({
            id: model.id,
            name: model.name,
            slug: model.slug,
            companyName: model.company?.name ?? "",
            providerName: "",        
            providerWebsite: "",   
            inputtokencost: 0,         
            outputtokencost: 0         
        }))

        return {
            models: formatted
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
                    select: { name: true }
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

        if (allModel.length === 0) {
            throw status(404, "No models and providers were found")
        }

        const flattened = allModel.flatMap(model =>
            model.modelProviderMappings.map(mapping => ({
                id: model.id,
                name: model.name,
                slug: model.slug,
                companyName: model.company?.name ?? "",
                providerName: mapping.provider?.name ?? "",
                providerWebsite: mapping.provider?.website ?? "",
                inputtokencost: mapping.inputtokencost ?? 0,
                outputtokencost: mapping.outputtokencost ?? 0
            }))
        )

        return {
            allModel: flattened
        }
    }

    static async getAllProvidersForModel({id}: {id: string}) {
        const findModel = await db.model.findUnique({
            where: {
                id: id
            }
        })

        if(!findModel) {
            throw status(404,"Invalid Model ID was provided")
        }

        const findProviders = await db.modelProviderMapping.findMany({
            where: {
                modelId: id
            },
            include: {
                provider: true
            }
        })

        return findProviders.map((x) => ({
            id: x.id,
            providerId: x.providerId,
            providerName: x.provider.name,
            providerWebsite: x.provider.website,
            inputTokenCost: x.inputtokencost,
            outputTokenCost: x.outputtokencost
        }))
    }
}

export default ModelService;
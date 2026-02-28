import Elysia, { t } from "elysia";
import Model from "./model";
import ModelService from "./service";

const model = new Elysia({prefix: '/model'})
    .get('/models', async ({set}) => {
        const response = await ModelService.getModels();
        set.status = 201;
        return {
            message: "All models were successfully fetched",
            models: response.models
        }
    },{
        response: {
            201: Model.getModelResponse,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .get('/providers', async ({ set }) => {
        const response = await ModelService.getProviders();
        set.status = 201;
        return {
            message: "All providers were successfully fetched",
            providers: response.provider
        }
    },{
        response: {
            201: Model.getProviderResponse,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .get('/modelprovider', async ({ set }) => {
        const response = await ModelService.getModelandProviders();
        set.status = 201;
        return {
            message: "All models and providers were successfully fetched",
            modelProviders: response.allModel
        }
    },{
        response: {
            201: Model.getModelProviderResponse,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
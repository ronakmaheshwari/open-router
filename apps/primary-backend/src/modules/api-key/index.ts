import Elysia, { t } from "elysia";
import userMiddleware from "../../middleware/middleware";
import Apikey from "./service";
import ApikeyModel from "./model";

const apikey = new Elysia({prefix: '/apikey'})
    .use(userMiddleware)
    .get('/', async ({userId , set}) => {
        const response = await Apikey.getKeys({userId});
        set.status = 201;
        return {
            message: "Apikeys were successfully fetched",
            data: {
                keys: response.keys
            }
        }
    },{
        response: {
            201: ApikeyModel.getKeysResponse,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .post('/create', async ({ userId, set, body }) => {
        const response = await Apikey.createKey({userId, name: body.name});
        set.status = 201;
        const formatedData = {
            id: response.key.id,
            name: response.key.name,
            apiKey: response.key.apiKey,
            createdAt: response.key.createdAt,
            creditsConsumed: response.key.creditsConsumed
        };
        return {
            message: "Apikey was successfully created",
            data: formatedData
        }
    },{
        body: ApikeyModel.createKeyBody,
        response: {
            201: ApikeyModel.createKeyResponse,
            500: t.Object({
                message: t.String()
            })
        }
    })
    .patch('/disable/:id', async ({ userId, set, params:{id}, body }) => {
        const response = await Apikey.disableKey({userId, id, disable: body.disabled});
        set.status = 201;
        return {
            message: `The given apikey was successfully ${body.disabled === true ? "disabled" : "enabled"}`
        }
    },{
        body: ApikeyModel.disableKeyBody,
        response: {
            201: ApikeyModel.disableKeyResponse,
            401: t.String(),
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .delete('/:id', async ({ userId, set, params: {id} }) => {
        const response = await Apikey.deleteKey({userId, id});
        set.status = 201
        return { 
            message: "The apikey was deleted successfully"
        }
    },{
        response: {
            201: ApikeyModel.deleteKeyResponse,
            401: t.String(),
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })

export default apikey;
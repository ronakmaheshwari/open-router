import { t, UnwrapSchema } from "elysia"

const keySchema = t.Object({
    id: t.String(),
    name: t.String(),
    apiKey: t.String(),
    disabled: t.Boolean(),
    is_deleted: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    lastUsed: t.Nullable(t.Date()),
    creditsConsumed: t.Number()
})

const ApikeyModel = {
    userIdSchema: t.Object({
        userId: t.String()
    }),

    getKeysResponse: t.Object({
        message: t.String(),
        data: t.Object({
            keys: t.Array(keySchema)
        })
    }),

    createKeyBody: t.Object({
        name: t.String()
    }),

    createKeyResponse: t.Object({
        message: t.String(),
        data: t.Object({
            id: t.String(),
            name: t.String(),
            apiKey: t.String(),
            createdAt: t.Date(),
            creditsConsumed: t.Number()
        })
    }),

    disableKeyBody: t.Object({
        disabled: t.Boolean()
    }),

    disableKeyResponse: t.Object({
        message: t.String()
    }),

    deleteKeyResponse: t.Object({
        message: t.String()
    })

} as const;

export type ApikeyModel = {
    [K in keyof typeof ApikeyModel]: UnwrapSchema<(typeof ApikeyModel) [K]>;
}

export default ApikeyModel;
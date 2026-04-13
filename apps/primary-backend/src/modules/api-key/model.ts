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

const recentSchema = t.Object({
  model: t.String(),
  tokens: t.Number(),
  createdAt: t.Date(),
});

const chartSchema = t.Object({
  date: t.Date(),
  tokens: t.Number(),
});

const usageDataSchema = t.Object({
  totalRequests: t.Number(),
  totalInputTokens: t.Number(),
  totalOutputTokens: t.Number(),
  apiKeys: t.Number(),
  recent: t.Array(recentSchema),
  usageByDay: t.Array(chartSchema),
});

const ApikeyModel = {
    userIdSchema: t.Object({
        userId: t.String()
    }),

    getKeyBody: t.Object({
        userId: t.String(),
        length: t.Optional(t.Number())
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
    }),

    usageResponse: t.Object({
        message: t.String(),
        data: usageDataSchema,
    }),

    errorResponse: t.Object({
        message: t.String(),
    }),


} as const;

export type ApikeyModel = {
    [K in keyof typeof ApikeyModel]: UnwrapSchema<(typeof ApikeyModel) [K]>;
}

export default ApikeyModel;
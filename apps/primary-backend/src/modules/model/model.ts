import { t } from "elysia"

const ModelInterface = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    companyName: t.String()
})

const ProviderInterface = t.Object({
    id: t.String(),
    name: t.String(),
    website: t.String()
})

const ModelProviderInterface = t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    companyName: t.String(),
    providerName: t.String(),
    providerWebsite: t.String(),
    inputtokencost: t.Number(),
    outputtokencost: t.Number()
})

const Model = {
    getModelResponse: t.Object({
        message: t.String(),
        data: t.Object({
            models: t.Array(ModelInterface)
        })
    }),

    getProviderResponse: t.Object({
        message: t.String(),
        data: t.Object({
            providers: t.Array(ProviderInterface)
        })
    }),

    getModelProviderResponse: t.Object({
        message: t.String(),
        data: t.Object({
            modelProviders: t.Array(ModelProviderInterface)
        })
    }),
}

export default Model;
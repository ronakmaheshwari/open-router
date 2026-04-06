import { t, UnwrapSchema } from "elysia";

const transactionSchema = t.Object({
    id: t.String(),
    amount: t.String(),
    status: t.String(),
    createdAt: t.Date()
})

const creditSchema = t.Object({
    amount: t.Number(),
    status: t.String()
})

const PaymentModel = {
    userIdSchema: t.Object({
        userId: t.String()
    }),

    getTransactions: t.Object({
        message: t.String(),
        data: t.Object({
            transactions: t.Array(transactionSchema)
        })
    }),

    getCredit: t.Object({
        message: t.String(),
        data: t.Object({
            credit: creditSchema
        })
    }),

    paymentBody: t.Object({
        userId: t.String(),
        card: t.String({
            minLength: 19,
            maxLength: 19,
            pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
            error: "Invalid card was provided",
        }),
        amount: t.Number({
            minimum: 10,
            maximum: 9999,
            error: "Invalid amount. It should be at least 10 and not more than 9999"
        })
    }),

    paymentSuccessResponse: t.Object({
        message: t.String({ default: "Payment successful" }),
        transactionId: t.String(),
        amount: t.Number(),
        credits: t.Number()
    }),

    paymentFailureResponse: t.Object({
        message: t.String({ default: "Payment unsuccessful" }),
        errorCode: t.String(),
        reason: t.Optional(t.String()),
    })
} as const

export type PaymentModel = {
    [K in keyof typeof PaymentModel]: UnwrapSchema<(typeof PaymentModel)[K]>;
}

export default PaymentModel
import Elysia, { t } from "elysia";
import userMiddleware from "../../middleware/middleware";
import PaymentService from "./service";
import PaymentModel from "./model";

const payment = new Elysia({prefix: '/payment'})
    .use(userMiddleware)
    .get('/transactions', async({userId, set}) => {
        const transactions = await PaymentService.getTransactions({userId});
        set.status = 201;
        
        return {
            message: "All Transactions were successfully fetched",
            data: {
                transactions: transactions
            }
        }
    },{
        response: {
            201: PaymentModel.getTransactions,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .get('/credit', async({userId, set}) => {
        const credit = await PaymentService.getCredit({userId});
        set.status = 201;

        return {
            message: "Your credits were successfully fetched",
            data: {
                credit: credit
            }
        }
    },{
        response: {
            201: PaymentModel.getCredit,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .post('/payment', async({userId, set, body}) => {
        const payment = await PaymentService.creditPayment({userId, card: body.card, amount: body.amount});
        set.status = 201;
        return {
            message: "Payment successfully handled",
            transactionId: payment.transactionId,
            amount: payment.amount,
            credits: payment.credit
        }
    },{
        body: PaymentModel.paymentBody,
        201: PaymentModel.paymentSuccessResponse,
        401: PaymentModel.paymentFailureResponse,
        500: t.Object({
            message: t.String()
        })
    })

export default payment;
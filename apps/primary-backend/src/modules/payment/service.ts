import db, { Prisma } from "@repo/db";
import { ApikeyModel } from "../api-key/model";
import { status } from "elysia";
import { PaymentModel } from "./model";
import creditGenerator from "../../utils/creditGenerator";

abstract class PaymentService {
    static async getTransactions({userId}: PaymentModel["userIdSchema"]) {
        const transactions = await db.onrampTransaction.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        if(transactions.length <= 0) {
            throw status(404, "No transactions were found")
        }

        const formatted = transactions.map(tx => ({
            id: tx.id,
            amount: String(tx.amount), 
            status: tx.status,
            createdAt: tx.createdAt   
        }))

        return formatted
    }

    static async getCredit({userId}: PaymentModel["userIdSchema"]) {
        const credit = await db.credit.findUnique({
            where: {
                userId: userId
            },
            select: {
                amount: true,
                status: true
            }
        })

        if(!credit) {
            throw status(404,"No credits found")
        }

        return {
            status: credit.status,
            amount: credit.amount
        }
    }

    static async creditPayment({userId, card, amount}: PaymentModel["paymentBody"]) {
        const creditAmount = creditGenerator(amount);

        const payment = await db.$transaction(async (x: Prisma.TransactionClient) => {
            const addCredit = await x.credit.upsert({
                where: {
                    userId: userId
                },
                create: {
                    userId: userId,
                    amount: creditAmount,
                    status: "ACTIVE",
                },
                update: {
                    userId: userId,
                    amount: {
                        increment: creditAmount
                    },
                    status: "ACTIVE"
                }
            })
            const addTransaction = await x.onrampTransaction.create({
                data: {
                    userId: userId,
                    amount: amount,
                    status: "SUCCESS",
                }
            })
            return {
                transactionId: addTransaction.id,
                amount: addTransaction.amount,
                credit: addCredit.amount
            }
        })

        return {
            transactionId: payment.transactionId,
            amount: payment.amount,
            credit: payment.credit
        }
    }
}

export default PaymentService
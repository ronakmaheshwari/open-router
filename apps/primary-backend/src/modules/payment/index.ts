import Elysia from "elysia";
import userMiddleware from "../../middleware/middleware";

const payment = new Elysia({prefix: '/payment'})
    .use(userMiddleware)
    .get('/transactions', async({userId, set}) => {
        
    })
import { Elysia } from "elysia";
import auth from "./modules/auth";
import pino from "pino"
import apikey from "./modules/api-key";
import { openapi } from '@elysiajs/openapi'
import model from "./modules/model";
import payment from "./modules/payment";
import cors from "@elysiajs/cors";

const logger = pino()

const apiV1 = new Elysia({ prefix: '/api/v1' })
  .use(auth)
  .use(apikey)
  .use(model)
  .use(payment)

const app = new Elysia()
  .onRequest(({ request })=>{
    logger.info({
      method: request.method,
      url: request.url
    })
  })
  .onError(({ code, error, set }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
        set.status = 500;
        return { message: "Internal server error" };
    }
  })
  .use(openapi())
  .use(cors())
  .get("/", () => "Hello Elysia")
  .use(apiV1)

export default app;

export type App = typeof app

// auth -> signup, signin
// api-key -> create api key, get apikey, delete apikey, disable apikey
// model -> get all provider, pricings, supported models etc
// payment -> rzp/stripe 
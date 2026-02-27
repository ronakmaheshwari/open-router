import { Elysia } from "elysia";
import db from "@repo/db"

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// auth -> signup, signin
// api-key -> create api key, get apikey, delete apikey, disable apikey
// model -> get all provider, pricings, supported models etc
// payment -> rzp/stripe 
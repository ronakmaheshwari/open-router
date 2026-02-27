import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT Secret is not set");

const jwtPlugin = new Elysia().use(
  jwt({
    name: "jwt",
    secret: jwtSecret,
  })
);

export default jwtPlugin;
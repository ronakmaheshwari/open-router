import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT Secret is not set");
}

export const userMiddleware = (app: Elysia) =>
  app
    .use(jwt({ name: "jwt", secret: jwtSecret }))
    .derive(async ({ jwt, request }) => {
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
      
      const token = authHeader.split(" ")[1];
      const payload = await jwt.verify(token) as { sub: string };
      
      if (!payload?.sub) throw new Error("Unauthorized");
      
      return { userId: payload.sub };
    });

export default userMiddleware;
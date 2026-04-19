import express,  { type Express, type Request, type Response } from "express"
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import db, { Prisma } from "@repo/db";
import router from "./routes/route";

dotenv.config()

export const app: Express = express();
export const port = process.env.PORT || 3002;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", router);

app.get("/health", async(req: Request, res: Response) => {
    try {
        await db.$queryRaw`SELECT 1`;

         return res.status(200).json({
            message: "Server is healthy",
            status: "ok",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: (error as Error).message,
            message: "Server is unhealthy",
            status: "fail",
            timestamp: new Date().toISOString()
        })
    }
})

app.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: "Hello Api Backend",
            status: "pass"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "fail",
            message: "Internal Error Occured",
            error: (error as Error).message
        })
    }
})

// app.listen(port,() => {
//     console.log(`Api-Backend is running on: http://localhost:${port}/`)
// })

app.listen({
  port: 3002,
  hostname: '0.0.0.0',
})
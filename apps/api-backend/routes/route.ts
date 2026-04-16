import { Router } from "express";
import conversationRouter from "./conversations";

const router: Router = Router()

interface RouterInterface {
    path: string,
    router: Router
}

const allRoutes: RouterInterface[] = [
    {
        path: "/chat",
        router: conversationRouter
    }
]

allRoutes.forEach((x) => {
    router.use(x.path, x.router)
})

export default router
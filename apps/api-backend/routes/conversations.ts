import { Router, type Request, type Response} from "express";

const conversationRouter: Router = Router();

conversationRouter.get("/", async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: "Hii there"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal error occured",
            error: error
        })
    }
})

export default conversationRouter;
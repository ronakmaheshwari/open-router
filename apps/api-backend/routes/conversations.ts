import { Router, type Request, type Response} from "express";
import userMiddleware from "../middleware/usermiddleware";
import { messageBodyType } from "@repo/validation";

const conversationRouter: Router = Router();

conversationRouter.get("/", userMiddleware, async (req: Request, res: Response) => {
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

conversationRouter.post("/completion", userMiddleware, async(req: Request, res: Response) => {
    try {
        const user = req.userId;
        if(!user) {
            return res.status(401).json({
                message: "You are unauthorized to access this services",
                error: true
            })
        }
        const parsed = messageBodyType.safeParse(req.body);
        if(!parsed.success) {
            return res.status(409).json({
                errors: parsed.error.format(),
                message: "Validation failed",
            });
        }
        const {model, messages} = parsed.data;
        
        return res.status(200).json({
            message:"hii"
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
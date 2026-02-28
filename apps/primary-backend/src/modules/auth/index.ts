import Elysia, { status, t } from "elysia";
import AuthModel from "./model";
import Auth from "./service";
import { jwt } from '@elysiajs/jwt'
import userMiddleware from "../../middleware/middleware";

const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret){
    throw new Error("JWT Secret is not set")
}

const auth = new Elysia({prefix: '/auth'})
    .use(
        jwt({
            name: 'jwt',
            secret: jwtSecret
        })
    )
    .post('/signup', async ({ body, jwt, set })=>{
        const response = await Auth.signUp(body);
        const token = await jwt.sign({ sub: response.userId, exp: "1d" });
        set.status = 201;
        return { message: "Signup successful", token };
    },{
        body: AuthModel.signUpBody,
        response: {
            201: AuthModel.signUpResponse,
            400: AuthModel.signUpInvalid,
            409: t.Object({
                message: t.String(),
            }),
            500: t.Object({
                message: t.String()
            })
        },
    })
    .post('/login', async ({ body, jwt, set }) => {
        const response = await Auth.signIn(body);
        const token = await jwt.sign({sub: response.userId, exp:"1d"});
        set.status = 201;
        return {
            message: "Signin Successful",
            token
        }
    },{
        body: AuthModel.signInBody,
        response: {
            201: AuthModel.signInResponse,
            400: AuthModel.signInInvalid,
            404: t.String(),
            401: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    })
    .use(userMiddleware)
    .get("/profile", async ({ userId, set }) => {
        const response = await Auth.getProfile({userId});
        set.status = 201
        return { 
            message: "Profile successfully fetched",
            data: {
                name: response.name,
                email: response.email
            }
         };
    },{
        response: {
            201: AuthModel.profileBodyResponse,
            404: t.String(),
            500: t.Object({
                message: t.String()
            })
        }
    });

export default auth;
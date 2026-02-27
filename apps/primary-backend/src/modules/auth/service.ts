import db from "@repo/db";
import type { AuthModel } from "./model";
import { status } from "elysia";

const saltRound = Number(process.env.SALT_ROUND)
if(!saltRound){
    throw new Error("No saltround was set")
}

abstract class Auth {
    static async signUp({name, email, password}: AuthModel["signUpBody"]) {
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if(user){
            throw status(409,`${email} already exist with our services`)
        }

        const hashedPassword = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: saltRound
        })

        const createUser = await db.user.create({
            data: {
                name: name,
                email: email, 
                password: hashedPassword
            }
        })

        return {
            userId: createUser.id,
        }
    }

    static async signIn({email, password}: AuthModel["signInBody"]) {
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user) {
            throw status(404,`The given ${email} was not found`)
        }

        const checkPassword = await Bun.password.verify(password,user.password);
        if(!checkPassword) {
            throw status(401, "Invalid password was provided")
        }

        return {
            userId: user.id
        }
    }
    
}

export default Auth;
import db from "@repo/db";
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

export default async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
        error: true,
      });
    }

    const token = authHeader.split(" ")[1] as string;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (error) {
      return res.status(403).json({
        message: "Invalid or expired token",
        error: true,
      });
    }

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        error: true,
      });
    }

    const userId = decoded.userId as string;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        error: true,
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
    });
  }
}
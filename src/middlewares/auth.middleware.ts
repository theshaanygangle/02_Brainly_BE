import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // space split
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const userMiddleware = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token Not Found!" });
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      id: string;
    };
    if (decoded) {
      req.userId = decoded.id; // ✅ Attach the userId to the request
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized User!" });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "") as any;

    // @ts-ignore
    req.user = decodedToken.user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid authentication token" });
  }
}

import { Router } from "express";
import { UserController } from "controllers/user";
import { authMiddleware } from "@middlewares";

const userRoutes = Router();

userRoutes.get("/user/:id", authMiddleware, UserController.getUserById);
userRoutes.delete("/user/:id", authMiddleware, UserController.deleteUser);
userRoutes.put("/user/:id", authMiddleware, UserController.updateUser);

export default userRoutes;

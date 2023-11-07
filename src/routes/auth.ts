import { Router } from "express";
import { AuthController } from "@controllers";

const authRoutes = Router();

authRoutes.post("/auth/sign-up", AuthController.signUp );
authRoutes.post("/auth/sign-in", AuthController.signIn);
authRoutes.post("/auth/forgot-password", AuthController.forgotPassword);
authRoutes.post("/auth/reset-password", AuthController.resetPassword);
authRoutes.post("/auth/change-password/:id", AuthController.changePassword);
export default authRoutes;

import { Router } from "express";
import { AuthControllers } from "@controllers";

const authRoutes = Router();

authRoutes.post("/auth/sign-up", AuthControllers.signUp );
authRoutes.post("/auth/sign-in", AuthControllers.signIn);
authRoutes.post("/auth/forgot-password", AuthControllers.forgotPassword);
authRoutes.post("/auth/reset-password", AuthControllers.resetPassword);
export default authRoutes;

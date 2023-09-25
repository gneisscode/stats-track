import { Router } from "express";
import { AuthControllers } from "@controllers";

const authRoutes = Router();

authRoutes.post("/auth/sign-up", AuthControllers.signUp );
authRoutes.post("/auth/sign-in", AuthControllers.signIn);

export default authRoutes;

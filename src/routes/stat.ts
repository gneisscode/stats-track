import { Router } from "express";
import { StatControllers } from "@controllers";
import { authMiddleware } from "@middlewares";

const statRoutes = Router();

statRoutes.post("/stat/create", authMiddleware, StatControllers.createStat);
statRoutes.get("/stat/:id", authMiddleware, StatControllers.getStatById)
statRoutes.get("/stats", authMiddleware, StatControllers.getAllStats);
statRoutes.get("/stats/user/:id", authMiddleware, StatControllers.getStatsByPresenterId);
statRoutes.get("/stats/school/:id", authMiddleware, StatControllers.getStatsBySchoolId);
statRoutes.put("/stat/update/:id", authMiddleware, StatControllers.updateStat)
statRoutes.delete("/stat/delete/:id", authMiddleware, StatControllers.deleteStat)

export default statRoutes;

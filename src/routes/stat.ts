import { Router } from "express";
import { StatController } from "@controllers";
import { authMiddleware } from "@middlewares";

const statRoutes = Router();

statRoutes.post("/stat/create", authMiddleware, StatController.createStat);
statRoutes.get("/stat/:id", authMiddleware, StatController.getStatById)
statRoutes.get("/stats", authMiddleware, StatController.getAllStats);
statRoutes.get("/stats/user/:id", authMiddleware, StatController.getStatsByPresenterId);
statRoutes.get("/stats/school/:id", authMiddleware, StatController.getStatsBySchoolId);
statRoutes.put("/stat/update/:id", authMiddleware, StatController.updateStat)
statRoutes.delete("/stat/delete/:id", authMiddleware, StatController.deleteStat)

export default statRoutes;

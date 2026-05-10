import { Router } from "express";
import { getDashboardController } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const DashboardRoutes = Router()

DashboardRoutes.get('/',authMiddleware.protect,getDashboardController)

export default DashboardRoutes;
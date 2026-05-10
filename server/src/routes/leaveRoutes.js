import { Router } from "express";
import { createLeaveController, getLeaveController, updateLeaveController } from "../controllers/leaveController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const leaveRoutes = Router()


leaveRoutes.post('/',authMiddleware.protect,createLeaveController)
leaveRoutes.get('/',authMiddleware.protect,getLeaveController)
leaveRoutes.patch('/:id',authMiddleware.protect,authMiddleware.protectAdmin,updateLeaveController)
export default leaveRoutes;

import { Router } from "express";
import profileController from "../controllers/profileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const profileRouter = Router()

profileRouter.get('/',authMiddleware.protect,profileController.getProfileController)
profileRouter.patch('/',authMiddleware.protect,profileController.updateProfileController)

export default profileRouter
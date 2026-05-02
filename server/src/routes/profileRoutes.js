import { Router } from "express";
import profileController from "../controllers/profileController";
import authMiddleware from "../middlewares/authMiddleware";

const profileRouter = Router()

profileRouter.get('/',authMiddleware.protect,profileController.getProfileController)
profileRouter.get('/',authMiddleware.protect,profileController.updateProfileController)

export default profileRouter
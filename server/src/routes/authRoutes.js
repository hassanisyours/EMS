import {Router}from 'express'
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const authRouter = Router();

authRouter.get('/session',authMiddleware.protect,authController.sessionController)
authRouter.post('/login',authController.loginConrtoller)
authRouter.post('/change-password',authMiddleware.protect,authController.changePasswordController)

export default authRouter
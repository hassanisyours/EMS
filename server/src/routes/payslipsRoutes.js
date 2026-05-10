import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createPayslipController, getPayslipByIdController, getPayslipController } from "../controllers/payslipController.js";

const PaySlipRouter  = Router()

PaySlipRouter.post('/',authMiddleware.protect,authMiddleware.protectAdmin,createPayslipController) 
PaySlipRouter.get('/',authMiddleware.protect,getPayslipController) 
PaySlipRouter.get('/:id',authMiddleware.protect,getPayslipByIdController) 

export default PaySlipRouter;
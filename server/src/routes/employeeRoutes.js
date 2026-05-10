import express from 'express'
import employeeController from '../controllers/employeeController.js'
import authController from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const ERouter = express.Router()


ERouter.get('/',authMiddleware.protect,authMiddleware.protectAdmin, employeeController.getEmployeeController)
ERouter.post('/',authMiddleware.protect,authMiddleware.protectAdmin, employeeController.createEmployeeController)
ERouter.put('/:id',authMiddleware.protect,authMiddleware.protectAdmin, employeeController.updateEmployeeController)
ERouter.delete('/:id',authMiddleware.protect,authMiddleware.protectAdmin, employeeController.deleteEmployeeController)


export default ERouter;
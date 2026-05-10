import { Router } from "express"; 
import authMiddleware from "../middlewares/authMiddleware.js";
import attendanceController from "../controllers/attendanceController.js";

const AttendanceRoutes = Router();

AttendanceRoutes.post('/',authMiddleware.protect,attendanceController.clockinOutController)
AttendanceRoutes.get('/',authMiddleware.protect,attendanceController.getAttendanceController)

export default AttendanceRoutes


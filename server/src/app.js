import express from "express";
import 'dotenv/config';
import cors from 'cors'
import multer from 'multer'
import connectDB from "./config/db.js";
import ERouter from "./routes/employeeRoutes.js";
import authRouter from "./routes/authRoutes.js";
import AttendanceRoutes from "./routes/attendanceRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import PaySlipRouter from "./routes/payslipsRoutes.js";
import DashboardRoutes from "./routes/deshboardRoutes.js";

const app = express();



app.use(cors())
app.use(express.json())
app.use(multer().none())


app.use('/api/employee',ERouter)
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/attendance',AttendanceRoutes)
app.use('/api/leave',leaveRoutes)
app.use('/api/payslip',PaySlipRouter)
app.use('/api/dashboard',DashboardRoutes)
app.get('/',(req,res)=>{
    res.send('HIII')
})

export default app;
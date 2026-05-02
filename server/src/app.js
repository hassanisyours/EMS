import express from "express";
import 'dotenv/config';
import cors from 'cors'
import multer from 'multer'
import connectDB from "./config/db.js";
import ERouter from "./routes/employeeRoutes.js";
import authRouter from "./routes/authRoutes.js";
import profilRouter from "./routes/profileRoutes.js";

const app = express();



app.use(cors())
app.use(express.json())
app.use(multer().none())


app.use('/api/employee',ERouter)
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)


export default app;
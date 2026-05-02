import mongoose from "mongoose";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connect successfully")
    } catch (error) {
        console.log("DB connection failed:", error.message)
        process.exit(1)
    }
} 

 export default connectDB

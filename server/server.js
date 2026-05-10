import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js"

 await connectDB()

 app.use("/api/inngest", serve({ client: inngest, functions }));


 const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
})
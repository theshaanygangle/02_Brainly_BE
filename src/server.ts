import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
const app = express();

//Middleware
app.use(express.json()); // Middleware use Karne ke liye

//Routes
app.use("/api/v1", authRouter);

//Start Server
const PORT = process.env.PORT || 4001;
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

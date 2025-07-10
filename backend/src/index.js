import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import cors from 'cors';
import { connectDB } from './lib/db.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true, // Allow credentials if needed
}));

app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);


app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
    connectDB()
});


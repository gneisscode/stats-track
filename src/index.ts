import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { authRoutes, statRoutes } from "@routes";
import cors from "cors"

const app = express();
dotenv.config()

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", statRoutes);


const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(()=>{
    console.log("successfully connected to db")
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

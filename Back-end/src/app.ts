import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import type { Request, Response } from 'express';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter)

app.use((req: Request, res: Response): void => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
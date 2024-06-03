import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./lib/db.js";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors("*"));
app.use(helmet());

app.disable("x-powered-by");

import authRouter from "./router/auth.router.js";
import userRouter from "./router/user.router.js";
import bookRouter from "./router/book.router.js";
import authorRouter from "./router/author.router.js";
import categoryRouter from "./router/category.router.js";

import { verifyToken } from "./middleware/auth.middleware.js";

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/.well-known/pki-validation/3CE78B620E7B3C6A4C4C814502D974F8.txt", (req, res) => {
 res.sendFile(path.join(__dirname, '3CE78B620E7B3C6A4C4C814502D974F8.txt')); 
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", verifyToken, userRouter);
app.use("/api/v1/book", verifyToken, bookRouter);
app.use("/api/v1/author", verifyToken, authorRouter);
app.use("/api/v1/category", verifyToken, categoryRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });

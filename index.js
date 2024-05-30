import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

import authRouter from "./router/auth.router.js";
import userRouter from "./router/user.router.js";
import bookRouter from "./router/book.router.js";

import { verifyToken } from "./middleware/auth.middleware.js";

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", verifyToken, userRouter);
app.use("/api/v1/book", verifyToken, bookRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });

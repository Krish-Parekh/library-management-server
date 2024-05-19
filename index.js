import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();

dotenv.config();
app.use(express.json());

import userRouter from "./router/user.router.js";
import bookRouter from "./router/book.router.js";
import { verifyToken } from "./middleware/auth.middleware.js";

app.use("/api/v1/auth", userRouter);
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

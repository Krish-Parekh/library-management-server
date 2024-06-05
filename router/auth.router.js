import { Router } from "express";
import {  
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/signup").post(signupUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;

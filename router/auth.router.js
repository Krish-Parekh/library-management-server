import { Router } from "express";
import {
  loginUser,
  signupUser,
} from "../controller/auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/signup").post(signupUser);

export default router;

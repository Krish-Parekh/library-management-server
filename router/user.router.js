import { Router } from "express";
import {
    getAllUser
} from "../controller/user.controller.js";

const router = Router();

router.route("/").get(getAllUser);

export default router;

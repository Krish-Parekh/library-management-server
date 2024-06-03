import { Router } from "express";
import {
    getAllUser,
    getUser,
    deleteUser
} from "../controller/user.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").get(authorize("admin"), getAllUser);
router.route("/:id").get(authorize("admin"), getUser)
router.route("/:id").delete(authorize("admin"), deleteUser);    
export default router;

import { Router } from "express";
import {
    getAllUser,
    getUser,
    deleteUser,
    updateUser
} from "../controller/user.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").get(authorize("admin"), getAllUser);
router.route("/:id").get(authorize("admin", "user"), getUser)
router.route("/:id").put(authorize("admin"), updateUser);
router.route("/:id").delete(authorize("admin"), deleteUser);    
export default router;

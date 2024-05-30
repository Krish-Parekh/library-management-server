import { Router } from "express";
import {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").post(authorize("admin"), createCategory);
router.route("/").get(authorize("admin"), getCategories);
router.route("/:id").get(authorize("admin"), getCategory);
router.route("/:id").put(authorize("admin"), updateCategory);
router.route("/:id").delete(authorize("admin"), deleteCategory);

export default router;

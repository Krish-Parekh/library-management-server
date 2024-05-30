import { Router } from "express";
import {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controller/author.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").post(authorize("admin"), createAuthor);
router.route("/").get(authorize("admin"), getAuthors);
router.route("/:id").get(authorize("admin"), getAuthor);
router.route("/:id").put(authorize("admin"), updateAuthor);
router.route("/:id").delete(authorize("admin"), deleteAuthor);

export default router;

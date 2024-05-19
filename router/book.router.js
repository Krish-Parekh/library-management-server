import { Router } from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controller/book.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/").get(authorize("user", "admin"), getBooks);
router.route("/").post(authorize("admin"), createBook);

router.route("/:id").get(authorize("user", "admin"), getBookById);
router.route("/:id").put(authorize("admin"), updateBook);
router.route("/:id").delete(authorize("admin"), deleteBook);

export default router;

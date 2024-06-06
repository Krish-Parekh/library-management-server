import { Router } from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  downloadBook,
} from "../controller/book.controller.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.route("/download").get(authorize("user", "admin"), downloadBook);
router.route("/").get(authorize("user", "admin"), getBooks);
router.route("/").post(authorize("admin"), createBook);

router.route("/:id").get(authorize("user", "admin"), getBookById);
router.route("/:id").put(authorize("admin"), updateBook);
router.route("/:id").delete(authorize("admin"), deleteBook);


export default router;

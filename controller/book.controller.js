import { Book } from "../model/book.model.js";
import { z } from "zod";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const bookSchema = z.object({
  title: z
    .string({ message: "Title can't be processed" })
    .min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string({ message: "Description can't be processed" })
    .min(10, { message: "Description must be at least 10 characters" }),
  authorId: z
    .string({ message: "Author ID can't be processed" })
    .min(3, { message: "Author ID must be at least 3 characters" }),
  isbn: z
    .string({ message: "ISBN can't be processed" })
    .length(13, { message: "ISBN must be exactly 13 characters" }),
  categoryId: z.string({ message: "Category ID can't be processed" }),
  userId: z.string({ message: "UserID can't be processed" }),
});

const createBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }
    const { title, description, authorId, isbn, categoryId, userId } =
      result.data;

    const book = new Book({
      title,
      description,
      authorId,
      isbn,
      categoryId,
      userId,
    });
    await book.save().catch((error) => {
      throw new ApiError(400, "Failed to create book. Please try again.");
    });
    return res
      .status(201)
      .json(new ApiResponse(201, book, "Book created successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate({ path: "authorId", select: "name" })
      .populate({ path: "categoryId", select: "name" })
      .populate({ path: "userId", select: "username email role" })
      .catch((error) => {
        throw new ApiError(500, "Failed to retrieve books. Please try again.");
      });
    return res
      .status(200)
      .json(new ApiResponse(200, books, "Books retrieved successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({ path: "authorId", select: "name" })
      .populate({ path: "categoryId", select: "name" })
      .populate({ path: "userId", select: "username email role" })
      .catch((error) => {
        throw new ApiError(404, "Failed to retrieve book. Please try again.");
      });
    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book retrieved successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const updateBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const book = await Book.findByIdAndUpdate(req.params.id, result.data, {
      new: true,
      runValidators: true,
    }).catch((error) => {
      throw new ApiError(404, "Failed to update book. Please try again.");
    });

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book updated successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Book ID is required");
    }

    const book = await Book.findByIdAndDelete(req.params.id).catch((error) => {
      throw new ApiError(404, "Failed to delete book. Please try again.");
    });

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Book deleted successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export { createBook, getBooks, getBookById, updateBook, deleteBook };

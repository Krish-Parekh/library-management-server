import { Book } from "../model/book.model.js";
import { z } from "zod";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const bookSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  authorId: z
    .string()
    .min(3, { message: "Author ID must be at least 3 characters" }),
  isbn: z
    .string()
    .length(13, { message: "ISBN must be exactly 13 characters" }),
  categoryId: z.string(),
});

const createBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }
    const { title, description, authorId, isbn, categoryId, userId } = result.data;

    const book = new Book({ title, description, authorId, isbn, categoryId, userId });
    await book.save();
    return res
      .status(201)
      .json(new ApiResponse(201, book, "Book created successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res
      .status(201)
      .json(new ApiResponse(200, books, "Books retrieved successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book retrieved successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const updateBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }

    const book = await Book.findByIdAndUpdate(req.params.id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book updated successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Book ID is required");
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Book deleted successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export { createBook, getBooks, getBookById, updateBook, deleteBook };

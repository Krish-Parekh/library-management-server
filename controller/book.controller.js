import { Book } from "../model/book.model.js";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  author: z.string().min(3),
  isbn: z.string().length(13),
  category: z.string(),
});

const createBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(
      req.body
    );
    console.log(result.data)
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const { title, description, author, isbn, category } = result.data;

    const book = new Book({ title, description, author, isbn, category });
    await book.save();

    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const result = bookSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, result.data, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createBook, getBooks, getBookById, updateBook, deleteBook };

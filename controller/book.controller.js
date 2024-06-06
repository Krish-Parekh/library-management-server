import { Book } from "../model/book.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { bookSchema } from "../util/schema/book.schema.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";




const createBook = async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, "Error validating request data.");
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const getBooks = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    
    const books = await Book.find(filter)
      .populate({ path: "authorId", select: "name",  })
      .populate({ path: "categoryId", select: "name" })
      .populate({ path: "userId", select: "username email role" })
      .catch((error) => {
        throw new ApiError(500, "Failed to retrieve books. Please try again.");
      });
    return res
      .status(200)
      .json(new ApiResponse(200, books, "Books retrieved successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Book ID is required");
    }

    const book = await Book.findById(id)
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Book ID is required");
    }

    const result = bookSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, "Error validating request data.");
    }

    await Book.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    }).catch((error) => {
      throw new ApiError(404, "Failed to update book. Please try again.");
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Book updated successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Book ID is required");
    }

    await Book.findByIdAndDelete(req.params.id).catch((error) => {
      throw new ApiError(404, "Failed to delete book. Please try again.");
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Book deleted successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const downloadBook = async(req, res) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const signedUrlExpireSeconds = 60 * 60; // 1 hour
    let command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: process.env.AWS_FILE_KEY,
    })
    let url = await getSignedUrl(s3Client, command, { expiresIn: signedUrlExpireSeconds });
    return res.redirect(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createBook, getBooks, getBookById, updateBook, deleteBook, downloadBook };

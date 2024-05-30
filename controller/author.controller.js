import { Author } from "../model/author.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { z } from "zod";

const authorSchema = z.object({
  name: z
    .string({ message: "Name can't be processed" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  description: z.string({ message: "Description can't be processed" }).min(10, {
    message: "Description must be at least 10 characters long",
  }),
  userId: z.string({ message: "UserID can't be processed" }),
});

export const createAuthor = async (req, res) => {
  try {
    const result = authorSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }
    const { name, description, userId } = result.data;
    const author = new Author({ name, description, userId });
    await author.save().catch((error) => {
      throw new ApiError(400, "Failed to create author. Please try again.");
    });
    return res
      .status(201)
      .json(new ApiResponse(201, "Author registered successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find()
      .populate({
        path: "userId",
        select: "username email role",
      })
      .catch((error) => {
        throw new ApiError(
          500,
          "Failed to retrieve authors. Please try again."
        );
      });
    return res.status(200).json(new ApiResponse(200, authors));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export const getAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }

    const author = await Author.findById(id)
      .populate({
        path: "userId",
        select: "username email role",
      })
      .catch((error) => {
        throw new ApiError(404, "Failed to retrieve author. Please try again.");
      });

    if (!author) {
      throw new ApiError(404, "Author not found.");
    }
    return res.status(200).json(new ApiResponse(200, author));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }
    const result = authorSchema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const { name, description, userId } = result.data;
    const author = await Author.findById(id).catch((error) => {
      throw new ApiError(404, "Failed to retrieve author. Please try again.");
    });

    if (!author) {
      throw new ApiError(404, "Author not found.");
    }

    author.name = name;
    author.description = description;
    author.userId = userId;

    await author.save().catch((error) => {
      throw new ApiError(400, "Failed to update author. Please try again.");
    });
    return res.status(200).json(new ApiResponse(200, "Author updated."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }
    const author = await Author.findById(id).catch((error) => {
      throw new ApiError(404, "Failed to retrieve author. Please try again.");
    });
    if (!author) {
      throw new ApiError(404, "Author not found.");
    }
    await author.deleteOne().catch((error) => {
      throw new ApiError(400, "Failed to delete author. Please try again.");
    });
    return res.status(200).json(new ApiResponse(200, "Author deleted."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

import { Author } from "../model/author.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { z } from "zod";

const authorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
});

export const createAuthor = async (req, res) => {
  try {
    const result = authorSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }
    const { name, description, userId } = result.data;
    const author = new Author({ name, description, userId });
    await author.save();
    return res
      .status(201)
      .json(new ApiResponse(201, "Author registered successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    return res.status(200).json(new ApiResponse(200, authors));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const getAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }
    const author = await Author.findById(id);
    if (!author) {
      throw new ApiError(404, "Author not found.");
    }
    return res.status(200).json(new ApiResponse(200, author));
  } catch (error) {}
};

export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }
    const result = authorSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }
    const { name, description } = result.data;
    const author = await Author.findById(id);
    if (!author) {
      throw new ApiError(404, "Author not found.");
    }
    author.name = name;
    author.description = description;
    await author.save();
    return res.status(200).json(new ApiResponse(200, "Author updated."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }
    const author = await Author.findById(id);
    if (!author) {
      throw new ApiError(404, "Author not found.");
    }
    await author.remove();
    return res.status(200).json(new ApiResponse(200, "Author deleted."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

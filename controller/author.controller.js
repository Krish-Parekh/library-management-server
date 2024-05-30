import { Author } from "../model/author.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { authorSchema } from "../util/schema/author.schema.js";

export const createAuthor = async (req, res) => {
  try {
    const result = authorSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Error validating request data.");
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
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
      throw new ApiError(400, "Error validating request data.");
    }

    await Author.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    }).catch((error) => {
      throw new ApiError(404, "Failed to update author. Please try again.");
    });

    return res.status(200).json(new ApiResponse(200, "Author updated."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Author id is required.");
    }

    await Author.findByIdAndDelete(id).catch((error) => {
      throw new ApiError(404, "Failed to delete author. Please try again.");
    });

    return res.status(200).json(new ApiResponse(200, "Author deleted."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

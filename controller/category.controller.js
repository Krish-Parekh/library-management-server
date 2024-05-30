import { Category } from "../model/category.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string({
      message: "Name can't be processed",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  userId: z.string({
    message: "UserID can't be processed",
  }),
});

const createCategory = async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }
    const { name, userId } = result.data;

    const category = new Category({ name, userId });
    await category.save().catch((error) => {
      throw new ApiError(400, "Failed to create category. Please try again.");
    });
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().catch((error) => {
      throw new ApiError(
        500,
        "Failed to retrieve categories. Please try again."
      );
    });
    return res.status(200).json(new ApiResponse(200, categories));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findById(id).catch((error) => {
      throw new ApiError(404, "Failed to retrieve category. Please try again.");
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return res.status(200).json(new ApiResponse(200, category));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      result.data,
      {
        new: true,
        runValidators: true,
      }
    ).catch((error) => {
      throw new ApiError(404, "Failed to update category. Please try again.");
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findByIdAndDelete(id).catch((error) => {
      throw new ApiError(404, "Failed to delete category. Please try again.");
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Category deleted successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

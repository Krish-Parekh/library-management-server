import { Category } from "../model/category.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

const createCategory = async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }
    const { name, userId } = result.data;

    const category = new Category({ name, userId });
    await category.save();
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(200, categories));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params.id;
    if (!id) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return res.status(200).json(new ApiResponse(200, category));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      result.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Category deleted successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
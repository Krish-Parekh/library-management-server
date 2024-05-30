import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).catch((error) => {
      throw new ApiError(500, "Failed to retrieve users. Please try again.");
    });
    return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }
    const user = await User.findById(id).catch((error) => {
      throw new ApiError(404, "Failed to retrieve user. Please try again.");
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const user = await User.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    }).catch((error) => {
      throw new ApiError(404, "Failed to update user. Please try again.");
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await User.findByIdAndDelete(req.params.id).catch((error) => {
      throw new ApiError(404, "Failed to delete user. Please try again.");
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully."));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export { getUser, getAllUser, updateUser, deleteUser };
import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { userSchema } from "../util/schema/user.schema.js";

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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).catch((error) => {
      throw new ApiError(500, "Failed to retrieve users. Please try again.");
    });
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    const { username, email } = req.body;

    if (!username || !email) {
      throw new ApiError(400, "Request data is required.");
    }

    const user = await User.findById(id).catch((error) => {
      throw new ApiError(404, "Failed to update user. Please try again.");
    });

    user.username = username;
    user.email = email;

    await User.updateOne({ _id: id }, user, {
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
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await User.findByIdAndDelete(id).catch((error) => {
      throw new ApiError(404, "Failed to delete user. Please try again.");
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

export { getUser, getAllUser, updateUser, deleteUser };

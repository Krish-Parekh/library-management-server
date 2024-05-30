import { User } from "../model/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.errors.join(", "));
    }

    const user = await User.findByIdAndUpdate(req.params.id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully."));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export { getUser, getAllUser, updateUser, deleteUser };

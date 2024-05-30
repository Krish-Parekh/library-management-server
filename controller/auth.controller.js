import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { loginSchema, signupSchema } from "../util/schema/auth.schema.js";

const loginUser = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Error validating request data");
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email }).catch(() => {
      throw new ApiError(404, "Failed to retrieve user. Please try again.");
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { token }, "User logged in successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const signupUser = async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Error validating request data");
    }

    const { username, email, password } = result.data;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User with email already exists");
    }

    const newUser = new User({ email, username, password });
    
    await newUser.save().catch((error) => {
      throw new ApiError(500, "Failed to register user. Please try again.");
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

export { loginUser, signupUser };

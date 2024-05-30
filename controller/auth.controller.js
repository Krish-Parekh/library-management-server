import { User } from "../model/user.model.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginUser = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email }).catch((error) => {
      throw new ApiError(404, "Failed to retrieve user. Please try again.");
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isMatch = await user.matchPassword(password).catch((error) => {
      throw new ApiError(401, "Invalid user credentials");
    });
    if (!isMatch) {
      throw new ApiError(401, "Invalid user credentials");
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, { token }, "User logged in successfully"));
  } catch (error) {
    return res.json(new ApiResponse(error.status, error.message));
  }
};

const signupUser = async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((error) => error.message);
      throw new ApiError(400, messages.join(", "));
    }

    const { username, email, password } = result.data;
    const existingUser = await User.findOne({ email }).catch((error) => {
      throw new ApiError(409, "Failed to retrieve user. Please try again.");
    });
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
    return res.json(new ApiResponse(error.status, error.message));
  }
};

export { loginUser, signupUser };

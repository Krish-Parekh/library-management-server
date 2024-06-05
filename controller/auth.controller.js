import { User } from "../model/user.model.js";
import { Token } from "../model/token.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../util/schema/auth.schema.js";

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
        expiresIn: "1h",
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

const forgotPassword = async (req, res) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error.errors.join(", "))
      throw new ApiError(400, "Error validating request data");
    }

    const { email } = req.body;

    const user = await User.findOne({ email }).catch(() => {
      throw new ApiError(404, "Failed to retrieve user. Please try again.");
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const token = await Token.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(resetToken, salt);

    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.CLIENT_URL}/reset-password/?token=${resetToken}&id=${user._id}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const html = `
    <div>
      <p>Hi ${user.username}, </p>
      <br />
      <p>You requested to reset your password</p>
      <p>Please, click the link below to reset your password</p>
      <br />
      <a href=${link}>Reset Password</a>
    </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Password Reset for ${user.username}`,
      text: `Click the following link to reset your password: ${link}`,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new ApiError(500, "Error sending email");
      } else {
        res
          .status(200)
          .send(
            new ApiResponse(
              201,
              "Check your email for instructions on resetting your password"
            )
          );
      }
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      console.log(result.error.errors.join(", "));
      throw new ApiError(400, "Error validating request data");
    }
    const { userId, token, password } = result.data;
    const passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new ApiError(404, "Invalid or expired reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new ApiError(401, "Invalid or expired reset token");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    await passwordResetToken.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successful"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
};

export { loginUser, signupUser, forgotPassword, resetPassword };

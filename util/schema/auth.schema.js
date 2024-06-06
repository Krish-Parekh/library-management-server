import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    })
    .min(8).max(255),
});

const signupSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email(),
  password: z
    .string()
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    })
    .min(8).max(255),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  userId: z.string(),
  token: z.string(),
  password: z
    .string()
    .regex(passwordRegex, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    })
    .min(8).max(255),
});

export { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema };

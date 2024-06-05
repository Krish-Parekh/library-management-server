import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  userId: z.string(),
  token: z.string(),
  password: z.string().min(6),
})

export { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema };
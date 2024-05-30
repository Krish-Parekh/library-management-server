import { z } from "zod";

const authorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  userId: z.string(),
});

export { authorSchema };
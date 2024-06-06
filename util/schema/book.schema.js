import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, { message: "Title must be at least 3 characters" }).max(500),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }).max(1000),
  authorId: z.string(),
  isbn: z.string().length(13, { message: "ISBN must be exactly 13 characters" }),
  categoryId: z.string(),
  userId: z.string(),
});

export { bookSchema };

import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  userId: z.string({
    message: "UserID can't be processed",
  }),
});

export { categorySchema };

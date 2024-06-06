import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(20),
  userId: z.string({ message: "UserID can't be processed" }),
});

export { categorySchema };

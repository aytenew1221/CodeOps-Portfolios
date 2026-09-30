import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^(09\d{8}|\+2519\d{8})$/, "Use 09... or +2519..."),

  dishId: z.string().min(1, "Dish is required"),
});

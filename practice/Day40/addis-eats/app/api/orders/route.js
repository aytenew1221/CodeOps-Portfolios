import { z } from "zod";

const orderSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters."),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+2519|09)\d{8}$/, "Enter a valid Ethiopian phone number."),

  dishId: z.string().min(1, "Dish ID is required.").optional(),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        {
          status: 422,
        },
      );
    }

    const order = {
      id: `ORD-${Date.now()}`,
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    console.log("API order created:", order);

    return Response.json(
      {
        success: true,
        message: "Order created successfully.",
        order,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return Response.json(
      {
        success: false,
        error: "Invalid JSON request body.",
      },
      {
        status: 400,
      },
    );
  }
}

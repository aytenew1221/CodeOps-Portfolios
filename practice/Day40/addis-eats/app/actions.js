"use server";

import { z } from "zod";

const orderSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters."),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+2519|09)\d{8}$/, "Enter a valid Ethiopian phone number."),
});

export async function placeOrder(previousState, formData) {
  const name = formData.get("name");
  const phone = formData.get("phone");

  const validation = orderSchema.safeParse({
    name,
    phone,
  });

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;

    return {
      success: false,
      errors,
      message: "Please correct the errors below.",
    };
  }

  const order = {
    id: `ORD-${Date.now()}`,
    name: validation.data.name,
    phone: validation.data.phone,
    createdAt: new Date().toISOString(),
  };

  console.log("Order created:", order);

  return {
    success: true,
    errors: {},
    message: `Order ${order.id} was placed successfully!`,
    order,
  };
}

export async function cancelOrder() {
  return {
    success: true,
    message: "Order cancelled.",
  };
}

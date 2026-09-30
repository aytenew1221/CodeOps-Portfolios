"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/schema";
import { dishes } from "@/lib/dishes";
import { orders } from "@/lib/orders";

/*
 * Demo authentication for the class assignment.
 *
 * In a production application, this function should
 * obtain the authenticated user from a real authentication
 * system/session.
 */
async function getCurrentUser() {
  return {
    id: "demo-user",
    name: "Demo User",
  };
}

export async function placeOrder(previousState, formData) {
  const result = orderSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    dishId: formData.get("dishId"),
  });

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const dish = dishes.find((dish) => dish.id === result.data.dishId);

  if (!dish) {
    return {
      success: false,
      error: "Dish not found",
      fieldErrors: {},
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Not signed in",
      fieldErrors: {},
    };
  }

  const order = {
    id: `ord-${Date.now()}`,
    userId: user.id,
    name: result.data.name,
    phone: result.data.phone,
    dishId: dish.id,
    dishName: dish.name,
    total: dish.price,
    currency: "ETB",
    status: "pending",
  };

  orders.push(order);

  revalidatePath("/orders");

  return {
    success: true,
    orderId: order.id,
    error: "",
    fieldErrors: {},
  };
}

export async function cancelOrder(formData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Not signed in",
    };
  }

  const orderId = formData.get("orderId");

  if (!orderId) {
    return {
      success: false,
      error: "Order ID is required",
    };
  }

  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    return {
      success: false,
      error: "Order not found",
    };
  }

  /*
   * SECURITY CHECK:
   *
   * The server checks ownership.
   * The client does not decide whether cancellation
   * is allowed.
   */
  if (order.userId !== user.id) {
    return {
      success: false,
      error: "You are not allowed to cancel this order",
    };
  }

  order.status = "cancelled";

  revalidatePath("/orders");

  return {
    success: true,
    error: "",
  };
}

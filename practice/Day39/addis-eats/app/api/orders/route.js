import { orderSchema } from "@/lib/schema";
import { dishes } from "@/lib/dishes";
import { orders } from "@/lib/orders";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Invalid JSON request",
      },
      {
        status: 400,
      },
    );
  }

  const result = orderSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: "Validation failed",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      {
        status: 422,
      },
    );
  }

  const dish = dishes.find((dish) => dish.id === result.data.dishId);

  if (!dish) {
    return Response.json(
      {
        error: "Dish not found",
      },
      {
        status: 404,
      },
    );
  }

  const order = {
    id: `ord-${Date.now()}`,
    userId: "demo-user",
    name: result.data.name,
    phone: result.data.phone,
    dishId: dish.id,
    dishName: dish.name,
    total: dish.price,
    currency: "ETB",
    status: "pending",
  };

  orders.push(order);

  return Response.json(order, {
    status: 201,
  });
}

import { addToCart, clearCart, getCart } from "@/lib/cart";

export async function GET() {
  return Response.json({
    success: true,
    data: getCart(),
  });
}

export async function POST(request) {
  try {
    const dish = await request.json();

    if (!dish?.id || !dish?.name || typeof dish.price !== "number") {
      return Response.json(
        { success: false, message: "Invalid dish data" },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Dish added to cart",
        data: addToCart(dish),
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  return Response.json({
    success: true,
    data: clearCart(),
  });
}

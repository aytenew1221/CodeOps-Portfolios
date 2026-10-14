import { getCurrentUser } from "@/lib/auth";
import { getUserOrders, createOrder } from "@/lib/orders";
import { getCart, clearCart } from "@/lib/cart";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Authentication required.",
      },
      { status: 401 },
    );
  }

  return Response.json({
    success: true,
    orders: getUserOrders(user.id),
  });
}

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Authentication required.",
      },
      { status: 401 },
    );
  }

  const cart = getCart(user.id);

  if (cart.length === 0) {
    return Response.json(
      {
        success: false,
        message: "Your cart is empty.",
      },
      { status: 400 },
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = createOrder({
    userId: user.id,
    customer: user.name,
    items: cart.map((item) => ({
      ...item,
    })),
    total,
  });

  clearCart(user.id);

  return Response.json(
    {
      success: true,
      message: "Order created successfully.",
      order,
    },
    { status: 201 },
  );
}

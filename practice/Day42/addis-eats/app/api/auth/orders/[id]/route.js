import { getCurrentUser } from "@/lib/auth";
import { getOrder, advanceOrder } from "@/lib/orders";

export async function GET(request, { params }) {
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

  const { id } = await params;

  const order = getOrder(id);

  if (!order) {
    return Response.json(
      {
        success: false,
        message: "Order not found.",
      },
      { status: 404 },
    );
  }

  /*
   * Customers can only see their own orders.
   * Staff can see any order.
   */
  if (user.role !== "staff" && order.userId !== user.id) {
    return Response.json(
      {
        success: false,
        message: "You are not allowed to access this order.",
      },
      { status: 403 },
    );
  }

  return Response.json({
    success: true,
    order,
  });
}

export async function PATCH(request, { params }) {
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

  /*
   * Only staff can change order status.
   */
  if (user.role !== "staff") {
    return Response.json(
      {
        success: false,
        message: "Staff access required.",
      },
      { status: 403 },
    );
  }

  const { id } = await params;

  const order = advanceOrder(id);

  if (!order) {
    return Response.json(
      {
        success: false,
        message: "Order not found.",
      },
      { status: 404 },
    );
  }

  return Response.json({
    success: true,
    message: "Order status updated.",
    order,
  });
}

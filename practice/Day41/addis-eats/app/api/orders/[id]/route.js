import { advanceOrder, getOrder } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return Response.json(
      { success: false, message: "Order not found" },
      { status: 404 },
    );
  }

  return Response.json({ success: true, order });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const order = advanceOrder(id);

  if (!order) {
    return Response.json(
      { success: false, message: "Order not found" },
      { status: 404 },
    );
  }

  return Response.json({ success: true, order });
}

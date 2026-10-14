import { addToCart, clearCart, getCart } from "@/lib/cart";
import { getDishById } from "@/lib/dishes";
import { getCurrentUser } from "@/lib/auth";

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
    data: getCart(user.id),
  });
}

export async function POST(request) {
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

  try {
    const body = await request.json();

    const dishId = Number(body?.id);

    if (!Number.isInteger(dishId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid dish ID.",
        },
        { status: 400 },
      );
    }

    /*
     * IMPORTANT:
     *
     * Do not trust the price/name sent by the browser.
     * Look up the dish on the server.
     */
    const dish = getDishById(dishId);

    if (!dish) {
      return Response.json(
        {
          success: false,
          message: "Dish not found.",
        },
        { status: 404 },
      );
    }

    const cart = addToCart(user.id, dish);

    return Response.json(
      {
        success: true,
        message: "Dish added to cart.",
        data: cart,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE() {
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
    data: clearCart(user.id),
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [],
    total: 0,
  });
}

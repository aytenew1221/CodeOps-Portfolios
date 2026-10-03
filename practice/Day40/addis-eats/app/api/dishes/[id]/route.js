import { getDishById } from "../../../../lib/dishes";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const dish = await getDishById(id);

    if (!dish) {
      return Response.json(
        {
          success: false,
          error: "Dish not found.",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        dish,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET /api/dishes/[id] error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to load dish.",
      },
      {
        status: 500,
      },
    );
  }
}

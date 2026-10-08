import { getDishes, getDishesByCategory } from "../../../lib/dishes";

export const revalidate = 60;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");

    const dishes = category
      ? await getDishesByCategory(category)
      : await getDishes();

    return Response.json(
      {
        success: true,
        count: dishes.length,
        dishes,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET /api/dishes error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to load dishes.",
      },
      {
        status: 500,
      },
    );
  }
}

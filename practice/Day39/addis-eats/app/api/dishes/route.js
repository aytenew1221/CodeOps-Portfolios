/**
 * This is a Next.js API route that handles GET requests for dishes.
 * It filters the dishes based on the provided category query parameter.
 * If no category is provided, it returns all dishes.
 */
import { dishes } from "@/lib/dishes";

export const revalidate = 60;

export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");

  const filteredDishes = category
    ? dishes.filter(
        (dish) => dish.category.toLowerCase() === category.toLowerCase(),
      )
    : dishes;

  return Response.json(filteredDishes);
}

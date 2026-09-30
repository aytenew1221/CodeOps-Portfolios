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

import { getCategories, getDishes } from "@/lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const pageParam = Number(searchParams.get("page") || "1");
  const limitParam = Number(searchParams.get("limit") || "4");

  const page =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 20
      ? Math.floor(limitParam)
      : 4;

  const filteredDishes = getDishes({ query, category });
  const total = filteredDishes.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = filteredDishes.slice(start, start + limit);

  return Response.json({
    success: true,
    data,
    page: safePage,
    limit,
    total,
    totalPages,
    categories: getCategories(),
  });
}

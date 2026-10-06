export const dishes = [
  {
    id: 1,
    name: "Chicken Tibs",
    description:
      "Tender chicken cooked with onions, tomatoes and Ethiopian spices.",
    price: 450,
    category: "Tibs",
  },
  {
    id: 2,
    name: "Beef Tibs",
    description:
      "Tender beef sautéed with onions, peppers and Ethiopian spices.",
    price: 520,
    category: "Tibs",
  },
  {
    id: 3,
    name: "Kitfo",
    description:
      "Traditional Ethiopian minced beef dish served with ayib and greens.",
    price: 650,
    category: "Traditional",
  },
  {
    id: 4,
    name: "Shiro",
    description: "Traditional chickpea stew served with injera.",
    price: 280,
    category: "Vegetarian",
  },
  {
    id: 5,
    name: "Doro Wot",
    description: "Spicy Ethiopian chicken stew served with injera.",
    price: 550,
    category: "Traditional",
  },
  {
    id: 6,
    name: "Vegetable Pasta",
    description:
      "Pasta prepared with fresh vegetables and a light tomato sauce.",
    price: 320,
    category: "Pasta",
  },
  {
    id: 7,
    name: "Special Burger",
    description:
      "Beef burger with cheese, tomato, lettuce and fresh vegetables.",
    price: 400,
    category: "Burger",
  },
  {
    id: 8,
    name: "Vegetable Pizza",
    description: "Pizza topped with fresh vegetables, herbs and cheese.",
    price: 500,
    category: "Pizza",
  },
  {
    id: 9,
    name: "Avocado Salad",
    description: "Fresh avocado, tomato, cucumber and herbs.",
    price: 300,
    category: "Vegetarian",
  },
  {
    id: 10,
    name: "Ethiopian Coffee",
    description:
      "Freshly roasted Ethiopian coffee served in the traditional style.",
    price: 120,
    category: "Drinks",
  },
  {
    id: 11,
    name: "Fresh Lemonade",
    description: "Fresh lemon juice with a refreshing touch of mint.",
    price: 100,
    category: "Drinks",
  },
  {
    id: 12,
    name: "Mango Juice",
    description: "Cold, fresh mango juice made from ripe mangoes.",
    price: 150,
    category: "Drinks",
  },
];

export function getDishes({ query = "", category = "" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  return dishes.filter((dish) => {
    const matchesQuery =
      !normalizedQuery ||
      dish.name.toLowerCase().includes(normalizedQuery) ||
      dish.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      !normalizedCategory || dish.category.toLowerCase() === normalizedCategory;

    return matchesQuery && matchesCategory;
  });
}

export function getDishById(id) {
  return dishes.find((dish) => dish.id === Number(id)) || null;
}

export function getCategories() {
  return [...new Set(dishes.map((dish) => dish.category))];
}

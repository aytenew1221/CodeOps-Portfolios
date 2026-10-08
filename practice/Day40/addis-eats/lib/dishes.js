const dishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 350,
    category: "traditional",
    description:
      "A rich Ethiopian chicken stew prepared with berbere, onions, spices, and boiled egg.",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 180,
    category: "vegetarian",
    description:
      "A smooth and flavorful chickpea stew prepared with Ethiopian spices.",
  },
  {
    id: "misir-wat",
    name: "Misir Wat",
    price: 160,
    category: "vegetarian",
    description:
      "Spicy red lentil stew cooked with berbere and traditional Ethiopian spices.",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    price: 320,
    category: "traditional",
    description:
      "Minced beef seasoned with mitmita and clarified spiced butter.",
  },
  {
    id: "tibs",
    name: "Tibs",
    price: 300,
    category: "traditional",
    description:
      "Sautéed beef pieces prepared with onions, peppers, and Ethiopian spices.",
  },
  {
    id: "firfir",
    name: "Firfir",
    price: 180,
    category: "traditional",
    description:
      "Pieces of injera mixed with spicy berbere sauce and Ethiopian butter.",
  },
  {
    id: "vegetable-tibs",
    name: "Vegetable Tibs",
    price: 220,
    category: "vegetarian",
    description:
      "Fresh vegetables sautéed with onions, peppers, and Ethiopian spices.",
  },
  {
    id: "pasta",
    name: "Ethiopian Pasta",
    price: 200,
    category: "fast-food",
    description:
      "Pasta prepared with tomato sauce, vegetables, and local spices.",
  },
  {
    id: "sambusa",
    name: "Sambusa",
    price: 100,
    category: "fast-food",
    description: "Crispy pastry filled with seasoned lentils and vegetables.",
  },
  {
    id: "chechebsa",
    name: "Chechebsa",
    price: 220,
    category: "traditional",
    description: "Pieces of flatbread mixed with spiced butter and berbere.",
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu",
    price: 280,
    category: "vegetarian",
    description:
      "A colorful combination of Ethiopian vegetarian dishes served with injera.",
  },
  {
    id: "genfo",
    name: "Genfo",
    price: 170,
    category: "traditional",
    description: "Traditional Ethiopian porridge served with spiced butter.",
  },
];

export async function getDishes() {
  return dishes;
}

export async function getDishById(id) {
  return dishes.find((dish) => dish.id === String(id));
}

export async function getDishesByCategory(category) {
  if (!category) {
    return dishes;
  }

  return dishes.filter(
    (dish) => dish.category.toLowerCase() === String(category).toLowerCase(),
  );
}

export default dishes;

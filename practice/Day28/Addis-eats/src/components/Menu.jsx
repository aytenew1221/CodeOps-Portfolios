import { useState } from "react";
import PropTypes from "prop-types";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

function Menu({ onAddToOrder }) {
  const categories = [
    "All",
    "Ethiopian",
    "Vegetarian",
    "Drinks",
    "Desserts",
    "Special",
  ];

  const dishes = [
    {
      id: 1,
      name: "Doro Wat",
      price: 350,
      category: "Ethiopian",
      spicy: true,
    },
    {
      id: 2,
      name: "Shiro",
      price: 180,
      category: "Vegetarian",
      spicy: true,
    },
    {
      id: 3,
      name: "Misir Wat",
      price: 160,
      category: "Vegetarian",
      spicy: true,
    },
    {
      id: 4,
      name: "Kitfo",
      price: 320,
      category: "Ethiopian",
      spicy: true,
    },
    {
      id: 5,
      name: "Mango Juice",
      price: 80,
      category: "Drinks",
      spicy: false,
    },
    {
      id: 6,
      name: "Tiramisu",
      price: 150,
      category: "Desserts",
      spicy: false,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <section className="menu-section">
      <h2>Our Menu</h2>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <DishList
        dishes={dishes}
        selectedCategory={selectedCategory}
        onAddToOrder={onAddToOrder}
      />
    </section>
  );
}

Menu.propTypes = {
  onAddToOrder: PropTypes.func.isRequired,
};

export default Menu;

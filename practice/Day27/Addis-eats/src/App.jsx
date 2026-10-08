import { useState } from "react";
import Header from "./components/Header";
import Dish from "./components/Dish";
import "./App.css";

const dishes = [
  {
    id: 1,
    name: "Doro Wot",
    price: 280,
    category: "Ethiopian",
    spicy: true,
  },
  {
    id: 2,
    name: "Tibs",
    price: 320,
    category: "Ethiopian",
    spicy: true,
  },
  {
    id: 3,
    name: "Shiro",
    price: 180,
    category: "Vegetarian",
    spicy: false,
  },
  {
    id: 4,
    name: "Misir Wot",
    price: 160,
    category: "Vegetarian",
    spicy: true,
  },
  {
    id: 5,
    name: "Pasta",
    price: 220,
    category: "Italian",
    spicy: false,
  },
  {
    id: 6,
    name: "Pizza",
    price: 350,
    category: "Italian",
    spicy: false,
  },
];

function App() {
  const [category, setCategory] = useState("All");

  const filteredDishes =
    category === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === category);

  return (
    <>
      <Header />

      <main className="container">
        <section className="menu-section">
          <h2>Our Menu</h2>

          <div className="filter-buttons">
            <button
              className={category === "All" ? "active" : ""}
              onClick={() => setCategory("All")}
            >
              All
            </button>

            <button
              className={category === "Ethiopian" ? "active" : ""}
              onClick={() => setCategory("Ethiopian")}
            >
              Ethiopian
            </button>

            <button
              className={category === "Vegetarian" ? "active" : ""}
              onClick={() => setCategory("Vegetarian")}
            >
              Vegetarian
            </button>

            <button
              className={category === "Italian" ? "active" : ""}
              onClick={() => setCategory("Italian")}
            >
              Italian
            </button>

            <button
              className={category === "Dessert" ? "active" : ""}
              onClick={() => setCategory("Dessert")}
            >
              Dessert
            </button>
          </div>

          {filteredDishes.length === 0 ? (
            <p className="empty-state">
              No dishes found in the {category} category.
            </p>
          ) : (
            <div className="menu">
              {filteredDishes.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  price={dish.price}
                  spicy={dish.spicy}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;

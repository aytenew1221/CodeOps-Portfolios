import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CategoryBar from "../components/CategoryBar";
import DishList from "../components/DishList";

function Menu({ onAddToCart }) {
  const categories = ["All", "Ethiopian", "Vegetarian", "Drinks", "Desserts"];

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "All";

  const selectedCategory = categories.includes(categoryFromUrl)
    ? categoryFromUrl
    : "All";

  const [dishes, setDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDishes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load menu. Server returned ${response.status}.`,
          );
        }

        const data = await response.json();

        setDishes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDishes();

    return () => {
      controller.abort();
    };
  }, []);

  const handleSelectCategory = (category) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category,
      });
    }
  };

  const filteredByCategory =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  const visibleDishes = filteredByCategory.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <section className="menu-section">
        <h2>Our Menu</h2>

        <div className="loading">
          <p>Loading menu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="menu-section">
        <h2>Our Menu</h2>

        <div className="error-box">
          <p className="error">Error: {error}</p>

          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-section">
      <h2>Our Menu</h2>

      <p className="url-info">
        Current category: <strong>{selectedCategory}</strong>
      </p>

      <input
        ref={searchInputRef}
        id="dish-search"
        name="dish-search"
        type="search"
        className="search-input"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search dishes..."
        aria-label="Search dishes"
        autoComplete="off"
      />

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <DishList dishes={visibleDishes} onAddToCart={onAddToCart} />
    </section>
  );
}

export default Menu;

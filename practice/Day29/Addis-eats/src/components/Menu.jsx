import { useEffect, useRef, useState } from "react";

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

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [dishes, setDishes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const searchInputRef = useRef(null);

  /*
   * Focus the search input when the
   * Menu component first loads.
   */
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  /*
   * Fetch the menu whenever the selected
   * category changes.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function loadDishes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        /*
         * Check whether the HTTP response
         * was successful.
         */
        if (!response.ok) {
          throw new Error(
            `Failed to load menu. Server returned ${response.status}.`,
          );
        }

        const data = await response.json();

        /*
         * Filter the menu according to
         * the selected category.
         */
        const filteredDishes =
          selectedCategory === "All"
            ? data
            : data.filter((dish) => dish.category === selectedCategory);

        setDishes(filteredDishes);
      } catch (err) {
        /*
         * AbortError happens when the previous
         * request is cancelled.
         *
         * We don't want to display that as
         * a normal error.
         */
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        /*
         * Don't change loading state after
         * the request was aborted.
         */
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDishes();

    /*
     * Cleanup:
     * Cancel the previous request when the
     * category changes or the component
     * unmounts.
     */
    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  /*
   * Loading early return
   */
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

  /*
   * Error early return
   */
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

  /*
   * Search filter happens after the
   * category filter.
   */
  const visibleDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="menu-section">
      <h2>Our Menu</h2>

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
        onSelectCategory={setSelectedCategory}
      />

      <DishList dishes={visibleDishes} onAddToOrder={onAddToOrder} />
    </section>
  );
}

Menu.propTypes = {
  onAddToOrder: PropTypes.func.isRequired,
};

export default Menu;

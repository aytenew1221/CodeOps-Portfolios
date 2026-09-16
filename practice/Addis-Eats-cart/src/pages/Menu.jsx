import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { useCartStore } from "../store/cartStore";

function Menu() {
  // Narrow selector: only the action required here
  const addItem = useCartStore((state) => state.addItem);

  const [dishes, setDishes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const category = searchParams.get("category") || "All";

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load the menu.");
        }

        const data = await response.json();

        setDishes(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadMenu();

    return () => {
      controller.abort();
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(dishes.map((dish) => dish.category))],
    [dishes],
  );

  const filteredDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesSearch = dish.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          category === "All" || dish.category === category;

        return matchesSearch && matchesCategory;
      }),
    [dishes, search, category],
  );

  const updateSearch = (value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set("search", value);
    } else {
      next.delete("search");
    }

    setSearchParams(next);
  };

  const updateCategory = (value) => {
    const next = new URLSearchParams(searchParams);

    if (value === "All") {
      next.delete("category");
    } else {
      next.set("category", value);
    }

    setSearchParams(next);
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <h1>Our Menu</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search dishes..."
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => updateCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredDishes.length === 0 ? (
        <p>No dishes found.</p>
      ) : (
        <div className="grid">
          {filteredDishes.map((dish) => (
            <article className="card" key={dish.id}>
              <img src={dish.image} alt={dish.name} />

              <h2>{dish.name}</h2>

              <p>{dish.description}</p>

              {dish.spicy && <p className="spicy">🌶️ Spicy</p>}

              <h3>{dish.price.toLocaleString()} ETB</h3>

              <div className="card-actions">
                <Link className="button secondary" to={`/menu/${dish.id}`}>
                  View Details
                </Link>

                <button onClick={() => addItem(dish)}>Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Menu;

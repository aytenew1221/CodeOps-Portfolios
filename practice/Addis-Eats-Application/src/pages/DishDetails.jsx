import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useCart } from "../context/CartContext";

export default function DishDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [dish, setDish] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDish() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load dish.");
        }

        const data = await response.json();

        const found = data.find((item) => item.id === id);

        setDish(found || null);
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

    loadDish();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="page">
        <p>Loading dish…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="error-box">
          <h2>Unable to load dish</h2>
          <p>{error}</p>
          <Link to="/menu">Back to menu</Link>
        </div>
      </section>
    );
  }

  if (!dish) {
    return (
      <section className="page">
        <div className="error-box">
          <h2>Dish not found</h2>

          <Link to="/menu">Back to menu</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page detail">
      <img src={dish.image} alt={dish.name} className="detail-image" />

      <div>
        <span className="badge">{dish.category}</span>

        <h1>{dish.name}</h1>

        <p>{dish.description}</p>

        <p className="rating">⭐ {dish.rating}</p>

        <h2>{dish.price.toLocaleString()} ETB</h2>

        <button
          className="button"
          type="button"
          onClick={() => addToCart(dish)}
        >
          Add to cart
        </button>

        <Link className="button secondary" to="/menu">
          Back to menu
        </Link>
      </div>
    </section>
  );
}

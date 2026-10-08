import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DishDetails({ onAddToCart }) {
  const { id } = useParams();

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
          throw new Error("Failed to load menu.");
        }

        const data = await response.json();

        const foundDish = data.find((item) => item.id === Number(id));

        if (!foundDish) {
          throw new Error("Dish not found.");
        }

        setDish(foundDish);
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

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <section className="details-page">
        <p>Loading dish...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="details-page">
        <div className="error-box">
          <p className="error">{error}</p>
          <Link to="/menu">Back to Menu</Link>
        </div>
      </section>
    );
  }

  const handleAdd = () => {
    onAddToCart(dish);
  };

  return (
    <section className="details-page">
      <div className="details-card">
        <Link className="back-link" to="/menu">
          ← Back to Menu
        </Link>

        <h2>{dish.name}</h2>

        <p className="details-category">Category: {dish.category}</p>

        {dish.spicy && <span className="spicy-badge">🌶 Spicy</span>}

        <p className="details-price">{dish.price.toLocaleString()} ETB</p>

        <p>Enjoy our delicious {dish.name}.</p>

        <button type="button" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </section>
  );
}

export default DishDetails;

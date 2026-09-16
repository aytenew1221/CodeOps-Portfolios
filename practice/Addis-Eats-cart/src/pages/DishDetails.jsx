import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useCartStore } from "../store/cartStore";

function DishDetails() {
  const { id } = useParams();

  // Narrow selector
  const addItem = useCartStore((state) => state.addItem);

  const [dish, setDish] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDish() {
      try {
        setLoading(true);

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load dish.");
        }

        const data = await response.json();

        const foundDish = data.find((item) => String(item.id) === String(id));

        setDish(foundDish || null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDish();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!dish) {
    return (
      <section>
        <h1>Dish Not Found</h1>

        <Link to="/menu">Back to Menu</Link>
      </section>
    );
  }

  return (
    <section className="details">
      <img src={dish.image} alt={dish.name} />

      <div>
        <h1>{dish.name}</h1>

        <p>{dish.description}</p>

        <p>Category: {dish.category}</p>

        {dish.spicy && <p className="spicy">🌶️ Spicy</p>}

        <h2>{dish.price.toLocaleString()} ETB</h2>

        <button onClick={() => addItem(dish)}>Add to Cart</button>

        <p>
          <Link to="/menu">← Back to Menu</Link>
        </p>
      </div>
    </section>
  );
}

export default DishDetails;

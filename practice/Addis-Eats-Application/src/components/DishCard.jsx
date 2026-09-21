/**
 * DishCard.jsx
 * This component represents a card displaying information about a dish.
 * It includes the dish's image, name, description, category, rating, and price.
 * Users can view more details, add the dish to their cart, or open a quick view modal.
 */
import { memo, useRef } from "react";

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function DishCard({ dish, onOpenModal }) {
  const { addToCart } = useCart();

  const renderCount = useRef(0);
  renderCount.current += 1;

  function forceError() {
    if (dish.id === "1") {
      throw new Error("Demo error: Doro Wat card intentionally crashed.");
    }
  }

  return (
    <article className="card">
      <img src={dish.image} alt={dish.name} className="dish-image" />

      <div className="card-body">
        <span className="badge">{dish.category}</span>

        <h3>{dish.name}</h3>

        <p>{dish.description}</p>

        <div className="rating">⭐ {dish.rating}</div>

        <strong>{dish.price.toLocaleString()} ETB</strong>

        <div className="card-actions">
          <Link className="button secondary" to={`/menu/${dish.id}`}>
            View
          </Link>

          <button
            className="button"
            type="button"
            onClick={() => addToCart(dish)}
          >
            Add
          </button>

          <button
            className="button secondary"
            type="button"
            onClick={() => onOpenModal(dish)}
          >
            Quick view
          </button>
        </div>

        <details className="debug-details">
          <summary>Resilience demo</summary>

          <small>Render count: {renderCount.current}</small>

          {dish.id === "1" && (
            <button
              type="button"
              className="danger-button"
              onClick={forceError}
            >
              Force render error
            </button>
          )}
        </details>
      </div>
    </article>
  );
}

export default memo(DishCard);

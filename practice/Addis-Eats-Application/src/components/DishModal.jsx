/**
 * DishModal.jsx
 * This component displays a modal dialog with details of a selected dish.
 * It allows users to view the dish's image, description, category, rating, and price.
 * Users can add the dish to their cart or close the modal.
 */
import { useEffect, useRef } from "react";

import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";

export default function DishModal({ dish, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!dish) {
      return;
    }

    previousFocusRef.current = document.activeElement;

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);

      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [dish, onClose]);

  if (!dish) {
    return null;
  }

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>

        <img src={dish.image} alt={dish.name} className="modal-image" />

        <span className="badge">{dish.category}</span>

        <h2 id="dish-modal-title">{dish.name}</h2>

        <p>{dish.description}</p>

        <p className="rating">⭐ {dish.rating}</p>

        <strong>{dish.price.toLocaleString()} ETB</strong>

        <button
          className="button full"
          type="button"
          onClick={() => {
            addToCart(dish);
            onClose();
          }}
        >
          Add to cart
        </button>
      </section>
    </div>,
    document.body,
  );
}

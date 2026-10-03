"use client";

import { useState } from "react";
import Link from "next/link";

const initialCart = [
  {
    id: "kitfo",
    name: "Kitfo",
    price: 320,
    quantity: 1,
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 180,
    quantity: 2,
  },
];

export default function CartClient() {
  const [cart, setCart] = useState(initialCart);

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div>
        <p>Your cart is empty.</p>

        <Link href="/menu" className="primary-button">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      {cart.map((item) => (
        <article className="cart-item" key={item.id}>
          <div>
            <h3>{item.name}</h3>

            <p>
              {item.price} ETB × {item.quantity}
            </p>
          </div>

          <div className="quantity-controls">
            <button onClick={() => decreaseQuantity(item.id)}>−</button>

            <strong>{item.quantity}</strong>

            <button onClick={() => increaseQuantity(item.id)}>+</button>

            <button
              className="remove-button"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </article>
      ))}

      <div className="cart-total">Total: {total} ETB</div>

      <div style={{ marginTop: "25px" }}>
        <Link href="/checkout" className="primary-button">
          Continue to Checkout
        </Link>
      </div>
    </div>
  );
}

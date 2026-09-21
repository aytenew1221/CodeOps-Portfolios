/**
 * CartPanel.jsx
 * This component displays the shopping cart panel, showing the items in the cart,
 * their quantities, and the total price. It allows users to increase or decrease
 * item quantities, remove items, clear the cart, and proceed to checkout.
 */
import { memo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPanel() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <aside className="cart-panel">
      <div className="section-heading">
        <h2>Your Cart</h2>

        {cart.length > 0 && (
          <button type="button" className="text-button" onClick={clearCart}>
            Clear
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <strong>{item.name}</strong>

                  <small>{item.price.toLocaleString()} ETB each</small>
                </div>

                <div className="quantity">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>

            <strong>{cartTotal.toLocaleString()} ETB</strong>
          </div>

          <Link className="button checkout-button" to="/checkout">
            Continue to checkout
          </Link>
        </>
      )}
    </aside>
  );
}

export default memo(CartPanel);

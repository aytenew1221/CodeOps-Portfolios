import { Link, useNavigate } from "react-router-dom";

import { useCartStore } from "../store/cartStore";

function Cart() {
  // Narrow selector 1
  const items = useCartStore((state) => state.items);

  // Narrow selector 2
  const removeItem = useCartStore((state) => state.removeItem);

  // Narrow selector 3
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  // Narrow selector 4
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  // Narrow selector 5
  const clearCart = useCartStore((state) => state.clearCart);

  const navigate = useNavigate();

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <section className="empty-cart">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link className="button" to="/menu">
          Browse Menu
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your Cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <article className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="cart-content">
              <h2>{item.name}</h2>

              <p>Price: {item.price.toLocaleString()} ETB</p>

              <div className="quantity">
                <button onClick={() => decreaseQuantity(item.id)}>−</button>

                <strong>{item.quantity}</strong>

                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>

              <p>
                Subtotal: {(item.price * item.quantity).toLocaleString()} ETB
              </p>

              <button
                className="danger"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Remove ${item.name} from your cart?`,
                  );

                  if (confirmed) {
                    removeItem(item.id);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: {cartTotal.toLocaleString()} ETB</h2>

        <button
          className="danger"
          onClick={() => {
            const confirmed = window.confirm("Clear the entire cart?");

            if (confirmed) {
              clearCart();
            }
          }}
        >
          Clear Cart
        </button>

        <button onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}

export default Cart;

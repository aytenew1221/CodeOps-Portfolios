import { Link } from "react-router-dom";

function Cart({ cart, cartTotal, onIncrease, onDecrease, onRemove, onClear }) {
  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <h2>Your Cart</h2>

        <div className="empty-state">
          <p>Your cart is empty.</p>

          <Link className="primary-link" to="/menu">
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div>
              <h3>{item.name}</h3>

              <p>{item.price.toLocaleString()} ETB</p>
            </div>

            <div className="quantity-controls">
              <button type="button" onClick={() => onDecrease(item.id)}>
                −
              </button>

              <strong>{item.quantity}</strong>

              <button type="button" onClick={() => onIncrease(item.id)}>
                +
              </button>
            </div>

            <p className="item-total">
              {(item.price * item.quantity).toLocaleString()} ETB
            </p>

            <button
              type="button"
              className="remove-button"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: {cartTotal.toLocaleString()} ETB</h3>

        <div className="cart-actions">
          <button type="button" className="secondary-button" onClick={onClear}>
            Clear Cart
          </button>

          <Link className="primary-link" to="/checkout">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;

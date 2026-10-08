import { useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card";

function Dish({ name, price, spicy = false, currency = "ETB", onAdd }) {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount((currentCount) => currentCount + 1);
    onAdd(price);
  };

  return (
    <Card>
      <div className="dish">
        <div>
          <h3>{name}</h3>

          {spicy === true && <span className="spicy-badge">🌶 Spicy</span>}
        </div>

        <p className="price">
          {price} {currency}
        </p>

        <p>
          Added: <strong>{count}</strong>
        </p>

        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
    </Card>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
};

Dish.defaultProps = {
  spicy: false,
  currency: "ETB",
};

export default Dish;

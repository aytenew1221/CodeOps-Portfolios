import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "./Card";

function Dish({ id, name, price, spicy = false, currency = "ETB", onAdd }) {
  const handleAdd = () => {
    onAdd({
      id,
      name,
      price,
      spicy,
    });
  };

  return (
    <Card>
      <div className="dish">
        <div>
          <h3>{name}</h3>

          {spicy === true && <span className="spicy-badge">🌶 Spicy</span>}
        </div>

        <p className="price">
          {price.toLocaleString()} {currency}
        </p>

        <div className="dish-actions">
          <Link className="details-link" to={`/menu/${id}`}>
            View Details
          </Link>

          <button type="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </Card>
  );
}

Dish.propTypes = {
  id: PropTypes.number.isRequired,
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

import PropTypes from "prop-types";
import Card from "./Card";

function Dish({ name, price, spicy, currency }) {
  return (
    <Card>
      <div className="dish">
        <div>
          <h2>{name}</h2>

          {spicy === true && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>

        <p className="price">
          {currency} {price.toFixed(2)}
        </p>
      </div>
    </Card>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
};

Dish.defaultProps = {
  currency: "ETB",
};

export default Dish;

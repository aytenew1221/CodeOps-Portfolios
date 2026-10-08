import PropTypes from "prop-types";
import Dish from "./Dish";

function DishList({ dishes, onAddToOrder }) {
  if (dishes.length === 0) {
    return (
      <div className="empty-state">
        <p>No dishes found.</p>
      </div>
    );
  }

  return (
    <div className="dish-list">
      {dishes.map((dish) => (
        <Dish
          key={dish.id}
          name={dish.name}
          price={dish.price}
          spicy={dish.spicy}
          onAdd={onAddToOrder}
        />
      ))}
    </div>
  );
}

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  onAddToOrder: PropTypes.func.isRequired,
};

export default DishList;

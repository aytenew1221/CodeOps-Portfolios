import PropTypes from "prop-types";
import Dish from "./Dish";

function DishList({ dishes, selectedCategory, onAddToOrder }) {
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  if (filteredDishes.length === 0) {
    return (
      <div className="empty-state">
        <p>No dishes found in this category.</p>
      </div>
    );
  }

  return (
    <div className="dish-list">
      {filteredDishes.map((dish) => (
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
  dishes: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onAddToOrder: PropTypes.func.isRequired,
};

export default DishList;

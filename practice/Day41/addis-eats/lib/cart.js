let cart = [];

export function getCart() {
  return cart;
}

export function addToCart(dish) {
  const existing = cart.find((item) => item.id === dish.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
    });
  }

  return cart;
}

export function clearCart() {
  cart = [];
  return cart;
}

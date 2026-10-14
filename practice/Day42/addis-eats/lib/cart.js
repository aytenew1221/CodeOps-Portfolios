const carts = new Map();

function getUserCart(userId) {
  if (!carts.has(userId)) {
    carts.set(userId, []);
  }

  return carts.get(userId);
}

export function getCart(userId) {
  return getUserCart(userId);
}

export function addToCart(userId, dish) {
  const cart = getUserCart(userId);

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

export function clearCart(userId) {
  carts.set(userId, []);

  return [];
}

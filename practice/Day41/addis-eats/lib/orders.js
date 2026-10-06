export const orders = {
  1001: {
    id: "1001",
    customer: "Abebe",
    status: "Preparing",
    total: 1250,
    items: ["Chicken Tibs", "Vegetable Pizza"],
  },
  1002: {
    id: "1002",
    customer: "Marta",
    status: "Ready",
    total: 850,
    items: ["Kitfo", "Ethiopian Coffee"],
  },
};

export const orderStatuses = ["Pending", "Preparing", "Ready", "Delivered"];

export function getOrder(id) {
  return orders[String(id)] || null;
}

export function advanceOrder(id) {
  const order = getOrder(id);

  if (!order) {
    return null;
  }

  const currentIndex = orderStatuses.indexOf(order.status);
  const nextIndex = Math.min(currentIndex + 1, orderStatuses.length - 1);

  order.status = orderStatuses[nextIndex];
  return order;
}

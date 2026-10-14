const orders = new Map([
  [
    "1001",
    {
      id: "1001",
      userId: "user-1",
      customer: "Abebe",
      status: "Preparing",
      total: 1250,
      items: [
        {
          name: "Chicken Tibs",
          quantity: 1,
          price: 450,
        },
        {
          name: "Vegetable Pizza",
          quantity: 1,
          price: 500,
        },
      ],
    },
  ],

  [
    "1002",
    {
      id: "1002",
      userId: "user-2",
      customer: "Marta",
      status: "Ready",
      total: 850,
      items: [
        {
          name: "Kitfo",
          quantity: 1,
          price: 650,
        },
        {
          name: "Ethiopian Coffee",
          quantity: 1,
          price: 120,
        },
      ],
    },
  ],
]);

const orderStatuses = ["Pending", "Preparing", "Ready", "Delivered"];

export function getOrder(id) {
  return orders.get(String(id)) || null;
}

export function getUserOrders(userId) {
  return [...orders.values()].filter((order) => order.userId === userId);
}

export function createOrder({ userId, customer, items, total }) {
  const id = String(Date.now());

  const order = {
    id,
    userId,
    customer,
    status: "Pending",
    total,
    items,
  };

  orders.set(id, order);

  return order;
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

export function getAllOrders() {
  return [...orders.values()];
}

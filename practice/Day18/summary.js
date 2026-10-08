// summary.js

import { withVat, format } from "./pricing.js";

const orders = [
  {
    id: 1,
    customer: "Abebe",
    items: [
      { name: "Teff Flour", price: 250, qty: 2 },
      { name: "Berbere", price: 100, qty: 1 },
    ],
  },

  {
    id: 2,
    customer: "Marta",
    items: [
      { name: "Coffee", price: 300, qty: 2 },
      { name: "Honey", price: 200, qty: 1 },
    ],
  },

  {
    id: 3,
    customer: "Dawit",
    items: [
      { name: "Injera", price: 80, qty: 2 },
      { name: "Shiro", price: 150, qty: 1 },
    ],
  },
];
// Add a total to every order
const ordersWithTotals = orders.map((order) => {
  const subtotal = order.items.reduce(
    (sum, { price, qty }) => sum + price * qty,
    0,
  );

  const total = withVat(subtotal);

  return {
    ...order,
    total,
  };
});

// Find orders over 500 ETB
const ordersOver500 = ordersWithTotals.filter((order) => order.total > 500);

// Calculate grand total
const grandTotal = ordersWithTotals.reduce(
  (sum, order) => sum + order.total,
  0,
);

// Print formatted summary
console.log("=== Addis Market Order Summary ===");

ordersWithTotals.forEach((order) => {
  console.log(`Order #${order.id} - ${order.customer}: ${format(order.total)}`);
});

console.log("\nOrders over 500 ETB:");

ordersOver500.forEach((order) => {
  console.log(`Order #${order.id} - ${order.customer}: ${format(order.total)}`);
});

console.log(`\nGrand Total: ${format(grandTotal)}`);

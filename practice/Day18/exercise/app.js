//  JavaScript Practice
// 1. map, filter, reduce
// ========================================

const prices = [500, 800, 1200, 300, 1500];

// Add 15% VAT
const pricesWithVat = prices.map((price) => price * 1.15);

console.log("Prices with VAT:", pricesWithVat);

// Keep prices under 1000 ETB
const under1000 = pricesWithVat.filter((price) => price < 1000);

console.log("Prices under 1000:", under1000);

// Calculate grand total
const grandTotal = under1000.reduce((total, price) => total + price, 0);

console.log("Grand Total:", grandTotal, "ETB");

// 2. Customer object + Object.entries

const customer = {
  name: "Abebe",
  city: "Addis Ababa",
  balance: 2500,
};

for (const [key, value] of Object.entries(customer)) {
  console.log(`${key}: ${value}`);
}

// 3. Destructuring

const { name, city } = customer;

console.log("Customer name:", name);
console.log("Customer city:", city);

function greet({ name }) {
  console.log(`Hello, ${name}!`);
}

greet(customer);

// 4. Spread - create updated copy

const updatedCustomer = {
  ...customer,
  city: "Bole",
  phone: "0911223344",
};

console.log("Original customer:", customer);
console.log("Updated customer:", updatedCustomer);

// 5. Module example


import { addVat, VAT } from "./money.js";

console.log("VAT rate:", VAT);

const price = 1000;
const finalPrice = addVat(price);

console.log("Final price:", finalPrice, "ETB");

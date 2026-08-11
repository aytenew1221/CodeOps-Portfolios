// order.js

// Calculate the subtotal of all prices
function subtotal(...prices) {
  return prices.reduce((total, price) => total + price, 0);
}

// Function factory for applying a discount
const discountBy = (rate) => (amount) => {
  return amount * (1 - rate);
};

// Add VAT
const withVat = (rate) => (amount) => {
  return amount * (1 + rate);
};

// Format amount as ETB
const toETB = (amount) => {
  return `${amount.toFixed(2)} ETB`;
};

// Closure-based receipt maker
function makeReceiptMaker() {
  let orderNumber = 0;

  return (amount) => {
    orderNumber++;

    return `#${orderNumber}: ${toETB(amount)}`;
  };
}

// Rates
const MEMBER_DISCOUNT = 0.1;
const VAT_RATE = 0.15;

// Create reusable functions
const memberDiscount = discountBy(MEMBER_DISCOUNT);
const addVat = withVat(VAT_RATE);

// Create the receipt maker
const receipt = makeReceiptMaker();

// Order 1
const order1 = addVat(memberDiscount(subtotal(200, 150, 100)));

console.log(receipt(order1));

// Order 2
const order2 = addVat(memberDiscount(subtotal(300, 250)));

console.log(receipt(order2));

// Order 3
const order3 = addVat(memberDiscount(subtotal(500, 100, 50)));

console.log(receipt(order3));

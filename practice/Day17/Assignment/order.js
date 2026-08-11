// Habesha entery order.js

// 1. Calculate subtotal using reduce
export const subtotal = (...prices) =>
  prices.reduce((total, price) => total + price, 0);

// 2. Function factory for discounts
export const discountBy = (rate) => (amount) => amount * (1 - rate);

// 3. Add VAT
export const withVat = (rate) => (amount) => amount * (1 + rate);

// 4. Convert amount to ETB
export const toETB = (amount) => `${amount.toFixed(2)} ETB`;

// 5. Closure-based receipt maker
export const makeReceiptMaker = () => {
  let orderNumber = 0;

  return (amount) => {
    orderNumber++;

    return `#${orderNumber}: ${toETB(amount)}`;
  };
};

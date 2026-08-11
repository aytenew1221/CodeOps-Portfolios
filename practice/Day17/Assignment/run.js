import { subtotal, discountBy, withVat, makeReceiptMaker } from "./order.js";

// Rates
const VAT_RATE = 0.15;
const MEMBER_DISCOUNT = 0.1;

// Create functions
const applyMemberDiscount = discountBy(MEMBER_DISCOUNT);
const addVat = withVat(VAT_RATE);

// Create receipt maker
const makeReceipt = makeReceiptMaker();

// Order 1
const order1Subtotal = subtotal(200, 150, 100);
const order1Discounted = applyMemberDiscount(order1Subtotal);
const order1Total = addVat(order1Discounted);

console.log(makeReceipt(order1Total));

// Order 2
const order2Subtotal = subtotal(300, 250);
const order2Discounted = applyMemberDiscount(order2Subtotal);
const order2Total = addVat(order2Discounted);

console.log(makeReceipt(order2Total));

// Order 3
const order3Subtotal = subtotal(500, 100, 50);
const order3Discounted = applyMemberDiscount(order3Subtotal);
const order3Total = addVat(order3Discounted);

console.log(makeReceipt(order3Total));

// app.js

import transactions from "./transactions.js";

import {
  getCredits,
  getDebits,
  getTotal,
  createReceipts,
  correctTransaction,
} from "./report.js";

// Separate transactions
const credits = getCredits(transactions);
const debits = getDebits(transactions);

// Calculate totals
const totalCredits = getTotal(credits);
const totalDebits = getTotal(debits);

// Create receipt strings
const receipts = createReceipts(transactions);

// Correct one transaction using spread
const originalTransaction = transactions[1];

const correctedTransaction = correctTransaction(originalTransaction, 350);

// Print report
console.log("===== TeleBirr Transaction Report =====");

console.log("Credits:", credits);
console.log("Debits:", debits);

console.log(`Total Credits: ETB ${totalCredits}`);
console.log(`Total Debits: ETB ${totalDebits}`);

console.log("\nReceipts:");

receipts.forEach((receipt) => {
  console.log(receipt);
});

console.log("\n===== Spread Example =====");

console.log("Original transaction:", originalTransaction);
console.log("Corrected transaction:", correctedTransaction);

console.log("Original unchanged:", originalTransaction.amount === 300);

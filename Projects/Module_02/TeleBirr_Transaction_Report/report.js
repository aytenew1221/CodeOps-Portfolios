// report.js

// Separate credit transactions
export function getCredits(transactions) {
  return transactions.filter(({ type }) => type === "credit");
}

// Separate debit transactions
export function getDebits(transactions) {
  return transactions.filter(({ type }) => type === "debit");
}

// Calculate total amount
export function getTotal(transactions) {
  return transactions.reduce((total, { amount }) => total + amount, 0);
}

// Build receipt strings
export function createReceipts(transactions) {
  return transactions.map(
    ({ customer, amount }) => `Receipt: ${customer} - ETB ${amount}`,
  );
}

// Create an updated copy without changing the original
export function correctTransaction(transaction, newAmount) {
  return {
    ...transaction,
    amount: newAmount,
  };
}

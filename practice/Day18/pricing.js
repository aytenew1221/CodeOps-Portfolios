// pricing.js

// Add 15% VAT
export const withVat = (amount) => amount * 1.15;

// Format money as ETB
export const format = (amount) => `${amount.toFixed(2)} ETB`;

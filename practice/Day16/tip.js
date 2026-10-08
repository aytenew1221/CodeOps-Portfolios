// Read values from the command line
const bill = Number(process.argv[2]);
const partySize = Number(process.argv[3]);
const paymentMethod = process.argv[4];

// Validate input
if (isNaN(bill) || isNaN(partySize) || partySize <= 0) {
  console.log("Please enter a valid bill and party size.");
  process.exit(1);
}

// Tiered tip
let tipRate;

if (bill > 300) {
  tipRate = 0.1; // 10%
} else {
  tipRate = 0.05; // 5%
}

const tip = bill * tipRate;

// Switch for payment service fee
let serviceFee;

switch (paymentMethod?.toLowerCase()) {
  case "telebirr":
    serviceFee = 5;
    break;

  case "cbe":
  case "cbe birr":
    serviceFee = 3;
    break;

  default:
    serviceFee = 0;
}

// Calculate total
const total = bill + tip + serviceFee;

// Calculate amount per person
const perPerson = total / partySize;

// Display results
console.log(`Bill: ${bill.toFixed(2)} ETB`);
console.log(`Tip: ${tip.toFixed(2)} ETB`);
console.log(`Service Fee: ${serviceFee.toFixed(2)} ETB`);
console.log(`Total: ${total.toFixed(2)} ETB`);
console.log(`Amount per person: ${perPerson.toFixed(2)} ETB`);
// to run the script, use the command: node tip.js <bill> <partySize> <paymentMethod>   e.g node tip.js 400 4 telebirr

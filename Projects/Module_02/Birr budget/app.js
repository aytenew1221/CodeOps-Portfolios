// DOM ELEMENTS

const form = document.querySelector("#transaction-form");

const descriptionInput = document.querySelector("#description");

const amountInput = document.querySelector("#amount");

const typeInput = document.querySelector("#type");

const categoryInput = document.querySelector("#category");

const formError = document.querySelector("#form-error");

const searchInput = document.querySelector("#search");

const transactionList = document.querySelector("#transaction-list");

const transactionCount = document.querySelector("#transaction-count");

const emptyMessage = document.querySelector("#empty-message");

const incomeTotal = document.querySelector("#income-total");

const expenseTotal = document.querySelector("#expense-total");

const balanceTotal = document.querySelector("#balance-total");

// Income page

const incomeList = document.querySelector("#income-list");

const incomeCount = document.querySelector("#income-count");

const incomeEmpty = document.querySelector("#income-empty");

const incomeViewTotal = document.querySelector("#income-view-total");

// Expense page

const expenseList = document.querySelector("#expense-list");

const expenseCount = document.querySelector("#expense-count");

const expenseEmpty = document.querySelector("#expense-empty");

const expenseViewTotal = document.querySelector("#expense-view-total");

// Reports

const reportIncome = document.querySelector("#report-income");

const reportExpense = document.querySelector("#report-expense");

const reportBalance = document.querySelector("#report-balance");

const expenseProgress = document.querySelector("#expense-progress");

const expenseRatio = document.querySelector("#expense-ratio");

const financialStatus = document.querySelector("#financial-status");

// Navigation

const navLinks = document.querySelectorAll(".nav-link");

const pageViews = document.querySelectorAll(".page-view");

// STATE

const state = {
  transactions: [],

  search: "",

  currentView: "dashboard",
};

// LOCAL STORAGE

const STORAGE_KEY = "birr-budget-transactions";

function loadTransactions() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return false;
  }

  try {
    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) {
      state.transactions = parsed;

      return true;
    }
  } catch (error) {
    console.error("Could not load saved transactions:", error);
  }

  return false;
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

// FORMAT ETB

function formatETB(amount) {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB`;
}

// VALIDATION

function validateTransaction(description, amount, category) {
  if (description.trim().length < 2) {
    return "Description must contain at least 2 characters.";
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Amount must be greater than 0.";
  }

  if (category.trim().length < 2) {
    return "Category must contain at least 2 characters.";
  }

  return "";
}

// CALCULATE TOTALS

function calculateTotals() {
  let income = 0;

  let expenses = 0;

  state.transactions.forEach((transaction) => {
    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      income += amount;
    } else if (transaction.type === "expense") {
      expenses += amount;
    }
  });

  return {
    income,

    expenses,

    balance: income - expenses,
  };
}

// FILTER TRANSACTIONS

function getFilteredTransactions(type = null) {
  const search = state.search.toLowerCase().trim();

  return state.transactions.filter((transaction) => {
    const matchesType = !type || transaction.type === type;

    const matchesSearch =
      !search ||
      transaction.description.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search) ||
      transaction.type.toLowerCase().includes(search);

    return matchesType && matchesSearch;
  });
}

// CREATE TRANSACTION ELEMENT

function createTransactionElement(transaction) {
  const li = document.createElement("li");

  li.className = "transaction-item";

  li.dataset.id = transaction.id;

  const info = document.createElement("div");

  info.className = "transaction-info";

  const title = document.createElement("h3");

  title.textContent = transaction.description;

  const category = document.createElement("p");

  category.textContent = `Category: ${transaction.category}`;

  const typeText = document.createElement("p");

  typeText.textContent = `Type: ${
    transaction.type === "income" ? "Income" : "Expense"
  }`;

  info.append(title, category, typeText);

  const meta = document.createElement("div");

  meta.className = "transaction-meta";

  const amount = document.createElement("strong");

  amount.className = transaction.type;

  const sign = transaction.type === "income" ? "+" : "-";

  amount.textContent = `${sign}${formatETB(Number(transaction.amount))}`;

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";

  deleteButton.className = "delete-btn";

  deleteButton.dataset.action = "delete";

  deleteButton.textContent = "Delete";

  meta.append(amount, deleteButton);

  li.append(info, meta);

  return li;
}

// RENDER LIST

function renderList(listElement, transactions, countElement, emptyElement) {
  listElement.textContent = "";

  countElement.textContent = `${transactions.length} transaction${
    transactions.length === 1 ? "" : "s"
  }`;

  emptyElement.hidden = transactions.length !== 0;

  transactions.forEach((transaction) => {
    listElement.appendChild(createTransactionElement(transaction));
  });
}

// RENDER DASHBOARD

function renderDashboard() {
  const totals = calculateTotals();

  incomeTotal.textContent = formatETB(totals.income);

  expenseTotal.textContent = formatETB(totals.expenses);

  balanceTotal.textContent = formatETB(totals.balance);

  const transactions = getFilteredTransactions();

  renderList(transactionList, transactions, transactionCount, emptyMessage);
}

// RENDER INCOME

function renderIncome() {
  const totals = calculateTotals();

  incomeViewTotal.textContent = formatETB(totals.income);

  const transactions = getFilteredTransactions("income");

  renderList(incomeList, transactions, incomeCount, incomeEmpty);
}

// RENDER EXPENSES

function renderExpenses() {
  const totals = calculateTotals();

  expenseViewTotal.textContent = formatETB(totals.expenses);

  const transactions = getFilteredTransactions("expense");

  renderList(expenseList, transactions, expenseCount, expenseEmpty);
}

// RENDER REPORTS

function renderReports() {
  const totals = calculateTotals();

  reportIncome.textContent = formatETB(totals.income);

  reportExpense.textContent = formatETB(totals.expenses);

  reportBalance.textContent = formatETB(totals.balance);

  // Expense ratio

  let ratio = 0;

  if (totals.income > 0) {
    ratio = (totals.expenses / totals.income) * 100;
  }

  const displayRatio = Math.min(ratio, 100);

  expenseProgress.style.width = `${displayRatio}%`;

  expenseRatio.textContent = `${ratio.toFixed(1)}% of income spent`;

  // Financial status

  if (state.transactions.length === 0) {
    financialStatus.textContent = "No financial data available.";
  } else if (totals.balance > 0) {
    financialStatus.textContent =
      "✓ Good: Your income is greater than your expenses.";
  } else if (totals.balance === 0) {
    financialStatus.textContent = "⚠ Your income and expenses are equal.";
  } else {
    financialStatus.textContent =
      "⚠ Warning: Your expenses are greater than your income.";
  }
}

// RENDER EVERYTHING

function render() {
  renderDashboard();

  renderIncome();

  renderExpenses();

  renderReports();
}

// NAVIGATION

function showView(viewName) {
  state.currentView = viewName;

  // Hide all pages

  pageViews.forEach((view) => {
    view.classList.remove("active-view");
  });

  // Show selected page

  const selectedView = document.querySelector(`#${viewName}`);

  if (selectedView) {
    selectedView.classList.add("active-view");
  }

  // Active navigation link

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === viewName);
  });

  // Update URL hash

  if (window.location.hash !== `#${viewName}`) {
    history.pushState(null, "", `#${viewName}`);
  }

  // Scroll to top

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// NAVIGATION EVENTS

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const view = link.dataset.view;

    showView(view);
  });
});

// BROWSER BACK / FORWARD

window.addEventListener("popstate", () => {
  const view = window.location.hash.replace("#", "");

  if (["dashboard", "income", "expenses", "reports"].includes(view)) {
    showView(view);
  } else {
    showView("dashboard");
  }
});

// ADD TRANSACTION

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formError.textContent = "";

  const description = descriptionInput.value.trim();

  const amount = Number(amountInput.value);

  const type = typeInput.value;

  const category = categoryInput.value.trim();

  const error = validateTransaction(description, amount, category);

  if (error) {
    formError.textContent = error;

    return;
  }

  const transaction = {
    id: Date.now(),

    description,

    amount,

    type,

    category,
  };

  state.transactions.unshift(transaction);

  saveTransactions();

  render();

  form.reset();

  descriptionInput.focus();

  // Go to appropriate page

  if (type === "income") {
    showView("income");
  } else {
    showView("expenses");
  }
});

// SEARCH

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;

  renderDashboard();
});

// DELETE TRANSACTION

document.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="delete"]');

  if (!button) {
    return;
  }

  const transactionItem = button.closest(".transaction-item");

  if (!transactionItem) {
    return;
  }

  const id = Number(transactionItem.dataset.id);

  state.transactions = state.transactions.filter(
    (transaction) => Number(transaction.id) !== id,
  );

  saveTransactions();

  render();
});

// LOAD INITIAL JSON DATA

async function loadInitialData() {
  const hasSavedData = loadTransactions();

  if (hasSavedData) {
    render();

    return;
  }

  try {
    const response = await fetch("./data/transactions.json");

    if (!response.ok) {
      throw new Error("Could not load transactions.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid transaction data.");
    }

    state.transactions = data;

    saveTransactions();

    render();
  } catch (error) {
    console.error(error);

    formError.textContent = "Could not load the initial budget data.";

    render();
  }
}

// INITIAL VIEW

function loadInitialView() {
  const hash = window.location.hash.replace("#", "");

  const validViews = ["dashboard", "income", "expenses", "reports"];

  if (validViews.includes(hash)) {
    showView(hash);
  } else {
    showView("dashboard");
  }
}

// INIT

async function init() {
  await loadInitialData();

  loadInitialView();
}

init();

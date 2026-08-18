const API = "https://open.er-api.com/v6/latest/ETB";
const status = document.querySelector("#status");
const select = document.querySelector("#currency");
const form = document.querySelector("#convert-form");
const amount = document.querySelector("#amount");
const result = document.querySelector("#result");
const watchlistElement = document.querySelector("#watchlist");
const watchCount = document.querySelector("#watch-count");
const emptyMessage = document.querySelector("#empty-message");

// STATE
const state = {
  base: "ETB",
  rates: {},
  watchlist: [],
  amount: 100,
  currency: "USD",
};

// LOCAL STORAGE KEY

const STORAGE_KEY = "birr-watch-watchlist";

// LOAD WATCHLIST

function loadWatchlist() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {
    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) {
      state.watchlist = parsed;
    }
  } catch (error) {
    console.error("Could not load watchlist:", error);
  }
}

// SAVE WATCHLIST

function saveWatchlist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.watchlist));
}
// STATUS

function setStatus(message, type = "") {
  status.textContent = message;

  status.className = "status";

  if (type) {
    status.classList.add(type);
  }
}

// ========================================
// FETCH RATES
// ========================================

async function fetchRates() {
  setStatus("Loading live exchange rates...");

  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates.");
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API returned an error.");
    }

    state.rates = data.rates;

    setStatus(
      `Rates updated successfully. Base currency: ${state.base}`,
      "success",
    );

    renderCurrencies();
    renderWatchlist();
  } catch (error) {
    console.error(error);

    setStatus("Unable to load exchange rates. Please try again.", "error");
  }
}

// ========================================
// RENDER CURRENCY DROPDOWN
// ========================================

function renderCurrencies() {
  select.innerHTML = "";

  const currencies = Object.keys(state.rates)
    .filter((currency) => currency !== state.base)
    .sort();

  currencies.forEach((currency) => {
    const option = document.createElement("option");

    option.value = currency;
    option.textContent = currency;

    if (currency === state.currency) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  if (!state.rates[state.currency]) {
    state.currency = currencies[0];
    select.value = state.currency;
  }
}

// ========================================
// CONVERT CURRENCY
// ========================================

function convertCurrency() {
  const value = Number(amount.value);
  const currency = select.value;

  // Validate amount
  if (!Number.isFinite(value) || value <= 0) {
    result.textContent = "Please enter an amount greater than 0.";
    return;
  }

  // Check rate
  const rate = state.rates[currency];

  if (!rate) {
    result.textContent = "Exchange rate is not available.";
    return;
  }

  state.amount = value;
  state.currency = currency;

  const converted = value * rate;

  result.textContent =
    `${value.toLocaleString()} ETB = ` +
    `${converted.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} ${currency}`;
}

// ========================================
// ADD TO WATCHLIST
// ========================================

function addToWatchlist(currency) {
  if (!currency) {
    return;
  }

  // Prevent duplicates
  if (state.watchlist.includes(currency)) {
    return;
  }

  state.watchlist.push(currency);

  saveWatchlist();
  renderWatchlist();
}

// ========================================
// RENDER WATCHLIST
// ========================================

function renderWatchlist() {
  watchlistElement.innerHTML = "";

  watchCount.textContent = state.watchlist.length;

  if (state.watchlist.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  state.watchlist.forEach((currency) => {
    const rate = state.rates[currency];

    const li = document.createElement("li");
    li.className = "watch-item";

    li.innerHTML = `
      <div class="watch-info">
        <strong>${currency}</strong>
        <span>
          ${rate ? `1 ETB = ${rate} ${currency}` : "Rate unavailable"}
        </span>
      </div>

      <button
        class="delete-btn"
        data-currency="${currency}"
        type="button"
      >
        Delete
      </button>
    `;

    watchlistElement.appendChild(li);
  });
}

// ========================================
// FORM SUBMIT
// ========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  convertCurrency();

  // Add selected currency to watchlist
  addToWatchlist(select.value);
});

// ========================================
// CURRENCY CHANGE
// ========================================

select.addEventListener("change", () => {
  state.currency = select.value;
});

// ========================================
// DELETE WATCHLIST ITEM
// EVENT DELEGATION
// ========================================

watchlistElement.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");

  if (!button) {
    return;
  }

  const currency = button.dataset.currency;

  state.watchlist = state.watchlist.filter((item) => item !== currency);

  saveWatchlist();
  renderWatchlist();
});

// ========================================
// START APPLICATION
// ========================================

function init() {
  loadWatchlist();
  fetchRates();
}

init();

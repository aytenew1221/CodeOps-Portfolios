const API = "https://open.er-api.com/v6/latest/ETB";

const STORAGE_KEY = "birr-watch";

const status = document.querySelector("#status");
const select = document.querySelector("#currency");
const form = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const result = document.querySelector("#result");
const watchlistList = document.querySelector("#watchlist-list");
const watchCount = document.querySelector("#watch-count");
const emptyMessage = document.querySelector("#empty-message");
const addWatchlistButton = document.querySelector("#add-watchlist");

const state = {
  base: "ETB",
  rates: {},
  watchlist: [],
  amount: 100,
  currency: "USD",
  status: "loading",
  error: "",
};

// LocalStorage

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      watchlist: state.watchlist,
      currency: state.currency,
    }),
  );
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    const data = JSON.parse(stored);

    if (Array.isArray(data.watchlist)) {
      state.watchlist = data.watchlist;
    }

    if (typeof data.currency === "string") {
      state.currency = data.currency;
    }
  } catch (error) {
    state.watchlist = [];
  }
}

// Render

function render() {
  renderStatus();
  renderCurrencies();
  renderResult();
  renderWatchlist();
}

function renderStatus() {
  status.className = "status";

  if (state.status === "loading") {
    status.textContent = "Loading exchange rates...";
    return;
  }

  if (state.status === "error") {
    status.textContent = state.error;
    status.classList.add("error");
    return;
  }

  status.textContent = "Live exchange rates loaded.";
  status.classList.add("success");
}

function renderCurrencies() {
  select.innerHTML = "";

  const currencies = Object.keys(state.rates).sort();

  currencies.forEach((currency) => {
    const option = document.createElement("option");

    option.value = currency;
    option.textContent = currency;

    if (currency === state.currency) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

function renderResult() {
  if (!state.amount || state.amount <= 0) {
    result.textContent = "";
    return;
  }

  const rate = state.rates[state.currency];

  if (!rate) {
    result.textContent = "";
    return;
  }

  const converted = state.amount * rate;

  result.textContent =
    `${state.amount.toLocaleString()} ETB = ` +
    `${converted.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })} ${state.currency}`;
}

function renderWatchlist() {
  watchlistList.innerHTML = "";

  watchCount.textContent = state.watchlist.length;

  emptyMessage.hidden = state.watchlist.length !== 0;

  state.watchlist.forEach((currency) => {
    const li = document.createElement("li");

    li.className = "watch-item";

    li.dataset.currency = currency;

    const name = document.createElement("span");
    name.textContent = currency;

    const button = document.createElement("button");

    button.className = "remove-btn";
    button.dataset.action = "remove";
    button.textContent = "Remove";

    li.appendChild(name);
    li.appendChild(button);

    watchlistList.appendChild(li);
  });
}

// Load live rates

async function loadRates() {
  state.status = "loading";
  state.error = "";

  render();

  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Unable to load exchange rates.");
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error("Exchange rate data is unavailable.");
    }

    state.rates = data.rates;

    if (!state.rates[state.currency]) {
      state.currency = "USD";
    }

    state.status = "success";

    render();
  } catch (error) {
    state.status = "error";
    state.error = "Could not load exchange rates. Please try again.";

    render();
  }
}

// Convert

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = Number(amountInput.value);

  if (!Number.isFinite(value) || value <= 0) {
    result.textContent = "Please enter an amount greater than 0.";

    return;
  }

  state.amount = value;
  state.currency = select.value;

  render();
});

// Currency change

select.addEventListener("change", () => {
  state.currency = select.value;

  save();
  render();
});

// Watchlist

addWatchlistButton.addEventListener("click", () => {
  addToWatchlist(state.currency);
});

watchlistList.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="remove"]');

  if (!button) {
    return;
  }

  const item = button.closest(".watch-item");

  const currency = item.dataset.currency;

  state.watchlist = state.watchlist.filter((item) => item !== currency);

  save();
  render();
});

// Add currency to watchlist

function addToWatchlist(currency) {
  if (!currency) {
    return;
  }

  if (state.watchlist.includes(currency)) {
    return;
  }

  state.watchlist.push(currency);

  save();
  render();
}

// Add button

select.addEventListener("dblclick", () => {
  addToWatchlist(select.value);
});

// Initialize

function init() {
  load();

  render();

  loadRates();
}

init();

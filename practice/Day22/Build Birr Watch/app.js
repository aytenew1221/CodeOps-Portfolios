"use strict";

/* API*/

const API = "https://open.er-api.com/v6/latest/ETB";

/* DOM ELEMENTS*/

const status = document.querySelector("#status");
const form = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const currencySelect = document.querySelector("#currency");
const convertButton = document.querySelector("#convert-button");
const result = document.querySelector("#result");

const watchlistElement = document.querySelector("#watchlist");
const watchCount = document.querySelector("#watch-count");
const emptyMessage = document.querySelector("#empty-message");

/* STORAGE*/

const STORAGE_KEY = "birr-watch-watchlist";

/* NUMBER FORMATTERS */

const etbFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

/* STATE */

const state = {
  base: "ETB",
  rates: {},
  watchlist: [],
  amount: 100,
  currency: "USD",
  loading: false,
};

/* STATUS*/

function setStatus(message, type = "") {
  status.textContent = message;

  status.className = "status";

  if (type) {
    status.classList.add(type);
  }
}

/* LOCAL STORAGE */

function loadWatchlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      state.watchlist = [];
      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      state.watchlist = [];
      return;
    }

    state.watchlist = parsed.filter(
      (currency) => typeof currency === "string" && currency.length > 0,
    );
  } catch (error) {
    console.error("Could not load watchlist:", error);

    state.watchlist = [];
  }
}

function saveWatchlist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.watchlist));
  } catch (error) {
    console.error("Could not save watchlist:", error);
  }
}

/* FETCH RATES */

async function fetchRates() {
  state.loading = true;

  setStatus("Loading live exchange rates...", "loading");

  currencySelect.disabled = true;
  convertButton.disabled = true;

  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.result !== "success" || typeof data.rates !== "object") {
      throw new Error("Invalid exchange-rate response.");
    }

    state.rates = data.rates;

    renderCurrencies();
    renderWatchlist();

    currencySelect.disabled = false;
    convertButton.disabled = false;

    setStatus(
      `Rates updated successfully. Base currency: ${state.base}`,
      "success",
    );

    convertCurrency();
  } catch (error) {
    console.error("Failed to fetch rates:", error);

    setStatus(
      "Unable to load exchange rates. Please check your internet connection and try again.",
      "error",
    );

    currencySelect.disabled = true;
    convertButton.disabled = true;
  } finally {
    state.loading = false;
  }
}

/* RENDER CURRENCIES */

function renderCurrencies() {
  const currencies = Object.keys(state.rates)
    .filter((currency) => currency !== state.base)
    .sort();

  currencySelect.replaceChildren();

  if (currencies.length === 0) {
    const option = document.createElement("option");

    option.value = "";
    option.textContent = "No currencies available";

    currencySelect.appendChild(option);

    return;
  }

  /*
    Keep USD if it exists.
    Otherwise select the first available currency.
  */
  if (!state.rates[state.currency]) {
    state.currency = currencies.includes("USD") ? "USD" : currencies[0];
  }

  currencies.forEach((currency) => {
    const option = document.createElement("option");

    option.value = currency;
    option.textContent = currency;

    if (currency === state.currency) {
      option.selected = true;
    }

    currencySelect.appendChild(option);
  });
}

/* CONVERT CURRENCY*/

function convertCurrency() {
  const value = Number(amountInput.value);
  const currency = currencySelect.value;

  /*
    Validate amount
  */
  if (!Number.isFinite(value) || value <= 0) {
    result.textContent = "Please enter an amount greater than 0.";

    return false;
  }

  /*
    Make sure a currency exists
  */
  if (!currency) {
    result.textContent = "Please select a currency.";

    return false;
  }

  /*
    Get exchange rate
  */
  const rate = state.rates[currency];

  if (typeof rate !== "number" || !Number.isFinite(rate)) {
    result.textContent = "Exchange rate is not available.";

    return false;
  }

  /*
    Update state
  */
  state.amount = value;
  state.currency = currency;

  /*
    Calculate conversion
  */
  const converted = value * rate;

  /*
    Format output
  */
  result.textContent =
    `${etbFormatter.format(value)} = ` +
    `${numberFormatter.format(converted)} ${currency}`;

  return true;
}

/*ADD TO WATCHLIST*/

function addToWatchlist(currency) {
  if (!currency) {
    return;
  }

  /*
    Prevent duplicates
  */
  if (state.watchlist.includes(currency)) {
    return;
  }

  state.watchlist.push(currency);

  saveWatchlist();
  renderWatchlist();
}

/* REMOVE FROM WATCHLIST */

function removeFromWatchlist(currency) {
  state.watchlist = state.watchlist.filter((item) => item !== currency);

  saveWatchlist();
  renderWatchlist();
}

/*RENDER WATCHLIST*/

function renderWatchlist() {
  watchlistElement.replaceChildren();

  watchCount.textContent = state.watchlist.length;

  /*
    Empty state
  */
  if (state.watchlist.length === 0) {
    emptyMessage.hidden = false;
    return;
  }

  emptyMessage.hidden = true;

  state.watchlist.forEach((currency) => {
    const rate = state.rates[currency];

    const li = document.createElement("li");

    li.className = "watch-item";

    /*
      Information container
    */

    const info = document.createElement("div");

    info.className = "watch-info";

    /*
      Currency name
    */

    const currencyName = document.createElement("strong");

    currencyName.className = "watch-currency";

    currencyName.textContent = currency;

    /*
      Exchange rate
    */

    const rateText = document.createElement("span");

    rateText.className = "watch-rate";

    if (typeof rate === "number" && Number.isFinite(rate)) {
      rateText.textContent = `1 ETB = ${numberFormatter.format(rate)} ${currency}`;
    } else {
      rateText.textContent = "Rate unavailable";
    }

    /*
      Delete button
    */

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-btn";

    deleteButton.dataset.currency = currency;

    deleteButton.textContent = "Delete";

    deleteButton.setAttribute(
      "aria-label",
      `Remove ${currency} from watchlist`,
    );

    /*
      Build item
    */

    info.append(currencyName, rateText);

    li.append(info, deleteButton);

    watchlistElement.appendChild(li);
  });
}

/* FORM SUBMIT */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const converted = convertCurrency();

  /*
      Only add to watchlist if
      conversion was successful.
    */
  if (converted) {
    addToWatchlist(currencySelect.value);
  }
});

/* AMOUNT INPUT */

amountInput.addEventListener("input", () => {
  /*
      Don't show an error while
      the user is typing.
    */
  result.textContent = "";
});

/* CURRENCY CHANGE*/

currencySelect.addEventListener("change", () => {
  state.currency = currencySelect.value;

  if (amountInput.value) {
    convertCurrency();
  }
});

/* 
   WATCHLIST CLICK
   EVENT DELEGATION */

watchlistElement.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");

  if (!button) {
    return;
  }

  const currency = button.dataset.currency;

  removeFromWatchlist(currency);
});

/* 
   INITIALIZE APPLICATION */

function init() {
  loadWatchlist();
  renderWatchlist();
  fetchRates();
}

/* 
   START*/

init();

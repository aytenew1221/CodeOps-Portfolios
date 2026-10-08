// ========================================
// DOM ELEMENTS
// ========================================

const form = document.querySelector("#country-form");
const countryInput = document.querySelector("#country-input");
const facts = document.querySelector("#facts");

// ========================================
// API BASE URL
// ========================================

const API_BASE = "https://countriesnow.space/api/v0.1/countries";

// ========================================
// RENDER A FACT
// ========================================

function render(parent, label, value) {
  const paragraph = document.createElement("p");

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  const span = document.createElement("span");
  span.textContent = value;

  paragraph.appendChild(strong);
  paragraph.appendChild(span);

  parent.appendChild(paragraph);
}

// ========================================
// FETCH COUNTRY DATA
// ========================================

async function fetchCountryData(countryName) {
  const encodedCountry = encodeURIComponent(countryName);

  // Load capital, currency, population and flag
  // at the same time.
  const [capitalRes, currencyRes, populationRes, flagRes] = await Promise.all([
    fetch(`${API_BASE}/capital/q?country=${encodedCountry}`),

    fetch(`${API_BASE}/currency/q?country=${encodedCountry}`),

    fetch(`${API_BASE}/population/q?country=${encodedCountry}`),

    fetch(`${API_BASE}/flag/images/q?country=${encodedCountry}`),
  ]);

  // Check HTTP responses
  if (!capitalRes.ok || !currencyRes.ok || !populationRes.ok || !flagRes.ok) {
    throw new Error("Unable to load country information.");
  }

  // Convert all responses to JSON
  const [capitalData, currencyData, populationData, flagData] =
    await Promise.all([
      capitalRes.json(),
      currencyRes.json(),
      populationRes.json(),
      flagRes.json(),
    ]);

  // Check API-level errors
  if (
    capitalData.error ||
    currencyData.error ||
    populationData.error ||
    flagData.error
  ) {
    throw new Error("Country information was not found.");
  }

  return {
    capital: capitalData.data,
    currency: currencyData.data,
    population: populationData.data,
    flag: flagData.data,
  };
}

// ========================================
// SHOW COUNTRY
// ========================================

async function showCountry(name) {
  // Loading state
  facts.textContent = "Loading...";

  try {
    const country = await fetchCountryData(name);

    // Clear loading message
    facts.innerHTML = "";

    // ========================================
    // COUNTRY CARD
    // ========================================

    const card = document.createElement("div");
    card.className = "country-card";

    // Country name
    const title = document.createElement("h2");
    title.textContent = country.population?.country || name;

    card.appendChild(title);

    // ========================================
    // FLAG
    // ========================================

    const flag = document.createElement("img");

    flag.className = "country-flag";

    // CountriesNow flag endpoint may return
    // an image URL inside the data object.
    const flagUrl = country.flag?.flag || country.flag?.url || country.flag;

    if (typeof flagUrl === "string" && flagUrl.startsWith("http")) {
      flag.src = flagUrl;
      flag.alt = `Flag of ${name}`;
      card.appendChild(flag);
    }

    // ========================================
    // CAPITAL
    // ========================================

    render(card, "Capital", country.capital?.capital || "N/A");

    // ========================================
    // CURRENCY
    // ========================================

    render(card, "Currency", country.currency?.currency || "N/A");

    // ========================================
    // POPULATION
    // ========================================

    const populationCounts = country.population?.populationCounts || [];

    let latestPopulation = "N/A";

    if (populationCounts.length > 0) {
      const latest = populationCounts[populationCounts.length - 1];

      latestPopulation = Number(latest.value).toLocaleString();
    }

    render(card, "Population", latestPopulation);

    // ========================================
    // ISO CODES
    // ========================================

    render(card, "ISO 2", country.capital?.iso2 || "N/A");

    render(card, "ISO 3", country.capital?.iso3 || "N/A");

    // ========================================
    // ADD CARD TO PAGE
    // ========================================

    facts.appendChild(card);
  } catch (error) {
    console.error(error);

    facts.textContent =
      error.message || "Something went wrong. Please try again.";
  }
}

// ========================================
// SEARCH EVENT
// ========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const countryName = countryInput.value.trim();

  if (countryName === "") {
    facts.textContent = "Please enter a country name.";

    return;
  }

  showCountry(countryName);
});

// ========================================
// DEFAULT COUNTRY
// ========================================

showCountry("Ethiopia");

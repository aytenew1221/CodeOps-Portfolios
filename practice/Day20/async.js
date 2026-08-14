// USD → ETB EXCHANGE RATE

async function getUsdToEtbRate() {
  try {
    const res = await fetch(
      "https://api.frankfurter.dev/v2/rate/USD/ETB?providers=NBE",
    );

    // Check HTTP response
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // Convert response to JSON
    const data = await res.json();

    console.log("USD → ETB:", data.rate);

    // Return the exchange rate
    return data.rate;
  } catch (error) {
    console.error("Failed to get USD → ETB rate:", error.message);
  }
}

getUsdToEtbRate();

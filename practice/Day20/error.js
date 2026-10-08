// NETWORK ERROR + HTTP 404 ERROR

async function testErrors() {
  // PART 1: DELIBERATELY WRONG URL

  try {
    await fetch("https://this-domain-does-not-exist-12345.com/data");

    console.log("This line should not normally run.");
  } catch (error) {
    console.log("Network error caught:", error.message);
  }

  // PART 2: REAL URL THAT RETURNS 404

  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts/999999",
    );

    console.log("404 response received.");
    console.log("res.ok:", res.ok);
    console.log("status:", res.status);

    // fetch() does not automatically reject
    // for HTTP 404, so we check res.ok.
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
  } catch (error) {
    console.log("HTTP error caught:", error.message);
  }
}

testErrors();

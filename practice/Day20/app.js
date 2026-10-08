// LOADING → SUCCESS / ERROR
// DOM ELEMENTS

const statusElement = document.querySelector("#status");
const dataElement = document.querySelector("#data");
const loadButton = document.querySelector("#load-button");

// LOAD DATA
async function load() {
  // LOADING STATE

  statusElement.textContent = "Loading...";
  dataElement.innerHTML = "";

  try {
    // FETCH DATA

    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5",
    );

    // Check HTTP response
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    // Convert response to JSON
    const posts = await res.json();

    // SUCCESS STATE

    statusElement.textContent = "Data loaded successfully.";

    posts.forEach((post) => {
      const article = document.createElement("article");

      article.className = "post";

      article.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
      `;

      dataElement.appendChild(article);
    });
  } catch (error) {
    // ERROR STATE
    statusElement.textContent = "Sorry, we could not load the data.";

    dataElement.innerHTML = `
      <p>Error: ${error.message}</p>
    `;
  }
}

// BUTTON EVENT

loadButton.addEventListener("click", load);

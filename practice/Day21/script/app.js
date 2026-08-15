const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const error = document.querySelector("#error");
const count = document.querySelector("#count");
const themeToggle = document.querySelector("#theme-toggle");

const phoneRegex = /^09\d{8}$/;

// 1. Theme toggle
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.style.background = "#222";
  document.body.style.color = "white";
}

themeToggle.addEventListener("click", () => {
  const dark = document.body.style.background === "rgb(34, 34, 34)";

  document.body.style.background = dark ? "white" : "#222";
  document.body.style.color = dark ? "black" : "white";

  localStorage.setItem("theme", dark ? "light" : "dark");
});

// 2. Save and load helpers
function save(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 3–5. Form validation
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  error.textContent = "";

  if (!name) {
    error.textContent = "Please enter your name.";
    return;
  }

  if (name.length < 2) {
    error.textContent = "Name must be at least 2 characters.";
    return;
  }

  if (!phone) {
    error.textContent = "Please enter your phone number.";
    return;
  }

  if (!phoneRegex.test(phone)) {
    error.textContent = "Enter a valid Ethiopian phone number.";
    return;
  }

  // 6. Save successful signup
  const people = load("signups");

  people.push({ name, phone });

  save("signups", people);

  form.reset();
  error.textContent = "Signup successful!";

  showCount();
});

// Show number of signups
function showCount() {
  const people = load("signups");
  count.textContent = `${people.length} people have signed up.`;
}

// Restore count on page load
showCount();

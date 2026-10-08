// DOM ELEMENTS

const form = document.querySelector("#signup-form");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const errorElement = document.querySelector("#error");
const signupList = document.querySelector("#signup-list");

// PHONE REGEX

// Accepts:
// 0912345678
// +251912345678

const PHONE = /^(?:\+251|0)9\d{8}$/;

// STORAGE KEY

const STORAGE_KEY = "signups";

// VALIDATION

function validate(name, phone) {
  if (name.trim().length < 2) {
    return "Enter your full name.";
  }

  if (!PHONE.test(phone.trim())) {
    return "Enter a valid Ethiopian phone number.";
  }

  return "";
}

// SAVE

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// LOAD

function load() {
  const stored = localStorage.getItem(STORAGE_KEY);

  // Nothing has been saved yet
  if (stored === null) {
    return [];
  }

  try {
    const entries = JSON.parse(stored);

    // Make sure the parsed data is an array
    if (!Array.isArray(entries)) {
      return [];
    }

    return entries;
  } catch (error) {
    // Corrupt JSON
    return [];
  }
}

// RENDER

function render(entries) {
  signupList.textContent = "";

  entries.forEach((entry) => {
    const listItem = document.createElement("li");

    listItem.textContent = `${entry.name} - ${entry.phone}`;

    signupList.appendChild(listItem);
  });
}

// FORM SUBMIT

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Trim values before using them
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  // Validate
  const errorMessage = validate(name, phone);

  if (errorMessage) {
    errorElement.textContent = errorMessage;
    return;
  }

  // Clear error
  errorElement.textContent = "";

  // Load existing entries
  const entries = load();

  // Add new signup
  entries.push({
    name: name,
    phone: phone,
  });

  // Save as JSON
  save(entries);

  // Render updated list
  render(entries);

  // Clear form
  form.reset();
});

// RESTORE DATA ON PAGE LOAD

const savedEntries = load();

render(savedEntries);

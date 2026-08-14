//DOM
// 1. Select an <h1>, change its text,
//    and toggle a CSS class
// ========================================

const heading = document.querySelector("#main-heading");

// Change the heading text
heading.textContent = "Day 19 JavaScript DOM Practice";

// Add/remove the CSS class
heading.classList.toggle("highlight");

// ========================================
// 2. Create <li> elements for Ethiopian cities
// ========================================

const cities = ["Addis Ababa", "Bahir Dar", "Gondar"];

const cityList = document.querySelector("#city-list");

cities.forEach((city) => {
  const li = document.createElement("li");

  li.textContent = city;

  cityList.append(li);
});

// ========================================
// 3. Click listener and event bubbling
// ========================================

const buttonContainer = document.querySelector("#button-container");
const clickButton = document.querySelector("#click-button");

// Listener on the button
clickButton.addEventListener("click", (event) => {
  console.log("Button listener");
  console.log("event.target:", event.target);
});

// Listener on the parent div
buttonContainer.addEventListener("click", (event) => {
  console.log("Div listener");
  console.log("event.target:", event.target);
});

// ========================================
// 4. Event delegation for delete buttons
// ========================================

const itemList = document.querySelector("#item-list");

// One listener on the parent
itemList.addEventListener("click", (event) => {
  // Check if the clicked element is a delete button
  if (event.target.classList.contains("delete-btn")) {
    // Find the <li> containing the button
    const item = event.target.closest("li");

    // Remove the item
    item.remove();
  }
});

// ========================================
// 5. Form submit
// ========================================

const form = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const formList = document.querySelector("#form-list");

form.addEventListener("submit", (event) => {
  // Prevent page refresh
  event.preventDefault();

  // Read the input value
  const itemText = itemInput.value.trim();

  // Don't add an empty item
  if (!itemText) {
    return;
  }

  // Create a new list item
  const li = document.createElement("li");

  // Put input value inside the <li>
  li.textContent = itemText;

  // Add it to the list
  formList.append(li);

  // Clear the input
  itemInput.value = "";

  // Put cursor back in input
  itemInput.focus();
});

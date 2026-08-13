// Cache DOM elements once
const form = document.querySelector("#item-form");
const itemNameInput = document.querySelector("#item-name");
const itemPriceInput = document.querySelector("#item-price");
const shoppingList = document.querySelector("#shopping-list");
const totalElement = document.querySelector("#total");
const messageElement = document.querySelector("#message");

// Store items in memory
const items = [];

// Add item
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const price = Number(itemPriceInput.value);

  // Validate fields
  if (!name || !itemPriceInput.value) {
    messageElement.textContent = "Please enter an item name and price.";
    return;
  }

  messageElement.textContent = "";

  const item = {
    id: Date.now(),
    name: name,
    price: price,
    bought: false,
  };

  items.push(item);

  renderItem(item);
  updateTotal();

  form.reset();
});

// Render one item
function renderItem(item) {
  const li = document.createElement("li");
  li.classList.add("item");

  li.dataset.id = item.id;

  const itemInfo = document.createElement("span");
  itemInfo.textContent = `${item.name} - ETB ${item.price}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.dataset.action = "delete";

  li.append(itemInfo, deleteButton);

  shoppingList.append(li);
}

// One delegated listener on the list
shoppingList.addEventListener("click", (event) => {
  const itemRow = event.target.closest(".item");

  if (!itemRow) {
    return;
  }

  // Delete item
  if (event.target.dataset.action === "delete") {
    const id = Number(itemRow.dataset.id);

    const index = items.findIndex((item) => item.id === id);

    if (index !== -1) {
      items.splice(index, 1);
    }

    itemRow.remove();

    updateTotal();

    return;
  }

  // Toggle bought state
  itemRow.classList.toggle("bought");

  const id = Number(itemRow.dataset.id);

  const item = items.find((item) => item.id === id);

  if (item) {
    item.bought = itemRow.classList.contains("bought");
  }
});

// Update running total
function updateTotal() {
  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  totalElement.textContent = `ETB ${total}`;
}

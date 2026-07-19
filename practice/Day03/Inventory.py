# Function to load stock from a file
def load_stock(filename):
    stock = {}

    try:
        with open(filename, "r") as file:
            for line in file:
                item, quantity = line.strip().split(",")
                stock[item] = int(quantity)

    except FileNotFoundError:
        print(f"{filename} not found.")
        print("Starting with an empty inventory.")

    return stock


# Function to update stock
def update_stock(stock, item, amount):
    if item in stock:
        stock[item] += amount
    else:
        stock[item] = amount

    # Prevent negative quantities
    if stock[item] < 0:
        stock[item] = 0


# Function to display low-stock items
def low_stock(stock):
    print("\nLow Stock Items (Less than 10)")

    found = False
    for item, quantity in stock.items():
        if quantity < 10:
            print(f"{item}: {quantity}")
            found = True

    if not found:
        print("No low-stock items.")


# Function to save stock back to file
def save_stock(filename, stock):
    with open(filename, "w") as file:
        for item, quantity in stock.items():
            file.write(f"{item},{quantity}\n")


# Main Program

filename = "stock.txt"

# Load inventory
inventory = load_stock(filename)

print("\nCurrent Inventory")
for item, quantity in inventory.items():
    print(f"{item}: {quantity}")

# Ask the user for an update
item = input("\nEnter item name: ").strip()
amount = int(input("Enter quantity to add (+) or remove (-): "))

update_stock(inventory, item, amount)

# Show updated inventory
print("\nUpdated Inventory")
for item, quantity in inventory.items():
    print(f"{item}: {quantity}")

# Show low-stock items
low_stock(inventory)

# Save changes
save_stock(filename, inventory)

print("\nInventory saved successfully.")
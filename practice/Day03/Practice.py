
# Day 03 Practice

# 1. Unique cities
print("1. Unique Cities")
cities = [
    "Addis Ababa",
    "Bahir Dar",
    "Hawassa",
    "Addis Ababa",
    "Dire Dawa",
    "Hawassa",
    "Mekelle"
]

unique_cities = set(cities)

print("Distinct cities:")
for city in unique_cities:
    print(city)

print("Total distinct cities:", len(unique_cities))

print("\n" + "=" * 40)


# 2. Price report
print("2. Price Report")

grocery_prices = {
    "Bread": 45,
    "Milk": 80,
    "Sugar": 95,
    "Rice": 180,
    "Eggs": 210
}

for item, price in grocery_prices.items():
    print(f"{item}: {price} ETB")

print("\n" + "=" * 40)


# 3. Tax comprehension
print("3. Tax Comprehension")

prices = [100, 250, 400, 80]

prices_with_tax = [price * 1.15 for price in prices]

print("Original prices:", prices)
print("Prices with 15% tax:", prices_with_tax)

print("\n" + "=" * 40)


# 4. Cheap items
print("4. Cheap Items")

cheap_prices = [price for price in prices if price < 200]

print("Prices under 200 ETB:", cheap_prices)

print("\n" + "=" * 40)


# 5. Write & read
print("5. Write and Read File")

customer_names = ["Abebe", "Sara", "Mulu"]

with open("names.txt", "w") as file:
    for name in customer_names:
        file.write(name + "\n")

print("Names written to names.txt")

print("Reading names from file:")

with open("names.txt", "r") as file:
    for line in file:
        print(line.strip())

print("\n" + "=" * 40)


# 6. Safe division
print("6. Safe Division")

try:
    number = float(input("Enter a number: "))
    result = 1000 / number
    print("Result:", result)

except ValueError:
    print("Error: Please enter a valid number.")

except ZeroDivisionError:
    print("Error: You cannot divide by zero.")
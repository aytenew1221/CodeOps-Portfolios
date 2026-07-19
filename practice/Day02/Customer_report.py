# customer_report.py
customers = [
    ("Abebe", 1500),
    ("Hana", 850),
    ("Samuel", 400),
    ("Meron", 1200),
    ("Dawit", 300),
    ("Liya", 650)
]
def tier(balance):
    if balance >= 1000:
        return "Premium"
    elif balance >= 500:
        return "Standard"
    else:
        return "Basic"

premium_count = 0
standard_count = 0
basic_count = 0

print("      TELEBIRR CUSTOMER REPORT")

# Loop through customers and print report
for name, balance in customers:
    customer_tier = tier(balance)

    print(f"Name: {name:<10} Tier: {customer_tier:<9} Balance: {balance:.2f} ETB")

    # Count each tier
    if customer_tier == "Premium":
        premium_count += 1
    elif customer_tier == "Standard":
        standard_count += 1
    else:
        basic_count += 1

print(f"Premium Customers : {premium_count}")
print(f"Standard Customers: {standard_count}")
print(f"Basic Customers   : {basic_count}")
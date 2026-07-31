# Restaurant Bill Splitter calculator

# Variables
bill_total = 3000.00  
people = 5

# List of friends
friends = ["Abebe", "Aytenew", "Ayele", "Belete"]


# Function to split the bill
def split_bill(total, people, tip_rate=0.10):
    """
    Calculate the amount each person should pay,
    including the tip.
    """
    tip = total * tip_rate
    total_with_tip = total + tip
    return total_with_tip / people


# Calculate each person's share
share = split_bill(bill_total, people)

# Display the result
print("====== Restaurant Bill Splitter ======")
print(f"Bill Total : {bill_total:.2f} ETB")
print(f"Tip (10%)  : {bill_total * 0.10:.2f} ETB")
print(f"Total Bill : {(bill_total * 1.10):.2f} ETB")
print(f"People     : {people}")
print(f"Each Pays  : {share:.2f} ETB\n")

# Print each friend's share
print("Payment Details")
for friend in friends:
    print(f"{friend} pays {share:.2f} ETB")
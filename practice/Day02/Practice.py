
#Countdown using while loop
n = 5
while n > 0:
    print(n)
    n -= 1
print("Liftoff!")   



# Function to apply a discount
def apply_discount(price, percent=15):
    discount_amount = price * (percent / 100)
    final_price = price - discount_amount
    return final_price

price1 = 1000
print("Original Price:", price1)
print("Price after  15% discount:", apply_discount(price1))



# Print even numbers from 1 to 20
for number in range(1, 21):
    if number % 2 == 0:
        print(number)



# Print receipt numbers 1 through 10
for number in range(1, 11):
    print(f"Receipt #{number}")



 # Temperature label
temperature = int(input("Enter the temperature (°C): "))
if temperature < 15:
    print("Cold")
elif 15 <= temperature < 28:
    print("Warm")
else:
    print("Hot")

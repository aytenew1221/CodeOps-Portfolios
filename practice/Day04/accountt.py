# Class, object and Encapsulation   for class work...
class Account:
    def __init__(self, owner, balance):
        self.owner = owner          # Public attribute
        self.__balance = balance    # Private attribute

    # Getter method
    def get_balance(self):
        return self.__balance

    # Deposit method
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"{amount} ETB deposited.")
        else:
            print("Invalid deposit amount.")

    # Withdraw method
    def withdraw(self, amount):
        if amount <= 0:
            print("Invalid withdrawal amount.")
        elif amount > self.__balance:
            print("Insufficient balance.")
        else:
            self.__balance -= amount
            print(f"{amount} ETB withdrawn.")

    # Display account information
    def display(self):
        print(f"Owner: {self.owner}")
        print(f"Balance: {self.__balance} ETB")


# Object Creation
Aytenew = Account("Aytenew", 1500000)

# Access public attribute
print(Aytenew.owner)

# Access private attribute through a method
print(Aytenew.get_balance())

# Perform transactions
Aytenew.deposit(500)
Aytenew.withdraw(300)

# Display final account details
Aytenew.display()


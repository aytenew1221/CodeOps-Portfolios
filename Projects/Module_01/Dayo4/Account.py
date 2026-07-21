#Addis Bank - Account Management System

class Account:
    
    
    

    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance  # Private attribute

    @property
    def balance(self):
        """Read-only access to the account balance."""
        return self.__balance

    def deposit(self, amount):
        """Deposit money into the account."""
        if amount <= 0:
            raise ValueError("Deposit amount must be greater than 0.")

        self.__balance += amount
        print(f"{amount:.2f} ETB deposited successfully.")

    def withdraw(self, amount):
        """Withdraw money from the account."""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than 0.")

        if amount > self.__balance:
            raise ValueError("Insufficient balance.")

        self.__balance -= amount
        print(f"{amount:.2f} ETB withdrawn successfully.")

    def statement(self):
        """Display account information."""
        print("\n========== Addis Bank ==========")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.__balance:.2f} ETB")
  


  


# Create object ==  account
Aytenew = Account("Aytenew Ayele", "1001001001", 5000)


# Display initial balances
print("Initial Account Statements")
Aytenew.statement()


# Deposit money
print("\nDepositing Money...")
Aytenew.deposit(1500)


# Withdraw money
print("\nWithdrawing Money...")
Aytenew.withdraw(1000)




# Read-only property demonstration
print(f"\nAytenew Balance: {Aytenew.balance:.2f} ETB")

# Uncommenting the next line will raise an AttributeError
# account1.balance = 10000

# Invalid operations
print("\nTesting Error Handling")

try:
    Aytenew.deposit(-100)
except ValueError as e:
    print("Deposit Error:", e)



try:
    Aytenew.withdraw(-500)
except ValueError as e:
    print("Withdrawal Error:", e)   
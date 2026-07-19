
# Addis Bank - Account Management System

class Account:
    def __init__(self, owner, account_number, balance=1500):
        # Public attributes
        self.owner = owner
        self.account_number = account_number

        # Private attribute
        self.__balance = balance

    # Read-only property
    @property
    def balance(self):
        return self.__balance

    # Deposit money
    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be greater than 0 ETB.")
        else:
            self.__balance += amount
            print(f"{amount:.2f} ETB deposited successfully.")

    # Withdraw money
    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be greater than 0 ETB.")
        elif amount > self.__balance:
            print("Insufficient balance.")
        else:
            self.__balance -= amount
            print(f"{amount:.2f} ETB withdrawn successfully.")

    # Display account statement
    def statement(self):
        print("\n========== Account Statement ==========")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.balance:.2f} ETB")
        print("=======================================\n")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=1500, interest_rate=0.05):
        super().__init__(owner, account_number, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        interest = self.balance * self.interest_rate
        self.deposit(interest)
        print(f"Interest of {interest:.2f} ETB applied at a rate of {self.interest_rate * 100:.2f}%.")
class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=1500, overdraft_limit=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be greater than 0 ETB.")
        elif amount > self.balance + self.overdraft_limit:
            print("Insufficient balance and overdraft limit exceeded.")
        else:
            self._Account__balance -= amount
            print(f"{amount:.2f} ETB withdrawn successfully. Current balance: {self.balance:.2f} ETB.")  


# Main Program

account1 = Account("Abebe Kebede", "10010001")

account1.statement()

print("Depositing 5000 ETB...")
account1.deposit(5000)

print("Withdrawing 1500 ETB...")
account1.withdraw(1500)

print("Trying to withdraw 10000 ETB...")
account1.withdraw(10000)

print("Trying to deposit -500 ETB...")
account1.deposit(-500)

account1.statement()
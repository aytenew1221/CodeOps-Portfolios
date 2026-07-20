class BalanceException(Exception):
    """Raised when a withdrawal exceeds the available balance."""
    pass


class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    # Protected method for subclasses
    def _update_balance(self, amount):
        self.__balance += amount

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be greater than 0 ETB.")

        self.__balance += amount
        print(f"{amount:.2f} ETB deposited successfully.")

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than 0 ETB.")

        if amount > self.__balance:
            raise BalanceException("Insufficient balance.")

        self.__balance -= amount
        print(f"{amount:.2f} ETB withdrawn successfully.")

    def statement(self):
        print("\n========== Account Statement ==========")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.balance:.2f} ETB")
        


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=1500, interest_rate=0.05):
        super().__init__(owner, account_number, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        interest = self.balance * self.interest_rate
        self.deposit(interest)
        print(f"Interest of {interest:.2f} ETB added.")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=1500, overdraft_limit=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than 0 ETB.")

        if amount > self.balance + self.overdraft_limit:
            raise BalanceException(
                "Insufficient balance and overdraft limit exceeded."
            )

        self._update_balance(-amount)

        print(
            f"{amount:.2f} ETB withdrawn successfully."
            f" Current balance: {self.balance:.2f} ETB"
        )




Aytenew = Account("Aytenew Ayele", "10010001")

try:
    Aytenew.statement()

    print("Depositing 5000 ETB...")
    Aytenew.deposit(5000)

    print("Withdrawing 1500 ETB...")
    Aytenew.withdraw(1500)

    print("Trying to withdraw 10000 ETB...")
    Aytenew.withdraw(10000)

except BalanceException as e:
    print("Balance Error:", e)

except ValueError as e:
    print("Input Error:", e)

finally:
    Aytenew.statement()


print("\n===== Savings Account =====")

savings = SavingsAccount("Sara", "20020001")

savings.statement()

savings.add_interest()

savings.statement()


print("\n===== Current Account =====")

current = CurrentAccount("Dawit", "30030001")

current.statement()

try:
    current.withdraw(2000)   # Balance 1500 + overdraft 1000 = 2500 allowed
    current.statement()

    current.withdraw(1000)   # Exceeds available limit

except BalanceException as e:
    print("Balance Error:", e)
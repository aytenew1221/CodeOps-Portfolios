#account.py
class BalanceException(Exception):
    pass


#  Observer 

class SMSAlert:
    def update(self, message):
        print(f"SMS Alert: {message}")


# Base Account 
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self._observers = []

    @property
    def balance(self):
        return self._balance

    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be greater than zero.")

        self._balance += amount
        self._notify(
            f"{self.owner} deposited {amount:.2f} ETB. "
            f"New balance: {self.balance:.2f} ETB"
        )

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than zero.")

        if amount > self.balance:
            raise BalanceException("Insufficient balance.")

        self._balance -= amount
        self._notify(
            f"{self.owner} withdrew {amount:.2f} ETB. "
            f"New balance: {self.balance:.2f} ETB"
        )


# Savings Account 

class SavingsAccount(Account):
    def __init__(self, owner, balance=0, interest_rate=0.02):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        interest = self.balance * self.interest_rate
        self._balance += interest

        self._notify(
            f"Interest of {interest:.2f} ETB added. "
            f"Balance: {self.balance:.2f} ETB"
        )


#  Current Account 
class CurrentAccount(Account):
    def __init__(self, owner, balance=0, overdraft_limit=1000):
        super().__init__(owner, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount > self.balance + self.overdraft_limit:
            raise BalanceException("Overdraft limit exceeded.")

        self._balance -= amount

        self._notify(
            f"{self.owner} withdrew {amount:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )


# Factory 
class AccountFactory:

    @staticmethod
    def create(kind, owner, balance=0):
        kind = kind.lower()

        if kind == "savings":
            return SavingsAccount(owner, balance)

        elif kind == "current":
            return CurrentAccount(owner, balance)

        else:
            raise ValueError("Unknown account type.")


#  Alert Service 
class AlertService:

    @staticmethod
    def attach(account):
        account.subscribe(SMSAlert())


# Main Program 

# Open accounts using the factory
savings = AccountFactory.create("savings", "Aytenew", 1500)
current = AccountFactory.create("current", "Aytenew", 2000)

# Attach SMS alerts
AlertService.attach(savings)
AlertService.attach(current)

# Transactions
savings.deposit(500)
savings.add_interest()

current.withdraw(2500)

print(f"\nSavings Balance: {savings.balance:.2f} ETB")
print(f"Current Balance: {current.balance:.2f} ETB")
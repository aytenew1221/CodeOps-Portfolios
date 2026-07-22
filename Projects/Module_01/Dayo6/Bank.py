#add account factory in addis bank managment system
class BalanceException(Exception):
    pass


# Singleton Pattern
class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance
    
# Observer Pattern
class SMSAlert:
    def update(self, message):
        print(f"SMS Alert: {message}")


class AuditLog:
    def update(self, message):
        print(f"Audit Log: {message}")


# Base Account
class Account:

    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []

    @property
    def balance(self):
        return self.__balance

    def _update_balance(self, amount):
        self.__balance += amount

    # Observer methods
    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def deposit(self, amount):

        if amount <= 0:
            raise ValueError("Deposit must be greater than zero.")

        self._update_balance(amount)

        self._notify(f"{amount:.2f} ETB deposited into {self.owner}'s account.")

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Withdrawal must be greater than zero.")

        if amount > self.balance:
            raise BalanceException("Insufficient balance.")

        self._update_balance(-amount)

        self._notify(f"{amount:.2f} ETB withdrawn from {self.owner}'s account.")

    def statement(self):
        print("\n========== Account Statement ==========")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.balance:.2f} ETB")


# Savings Account
class SavingsAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)

        self.config = BankConfig()

    def add_interest(self):

        interest = self.balance * self.config.interest_rate

        self.deposit(interest)


# Current Account

class CurrentAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)

        self.config = BankConfig()

    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Withdrawal must be greater than zero.")

        if amount > self.balance + self.config.overdraft_limit:
            raise BalanceException(
                "Overdraft limit exceeded."
            )

        self._update_balance(-amount)

        self._notify(f"{amount:.2f} ETB withdrawn from {self.owner}'s current account.")

# Factory Pattern
class AccountFactory:

    @staticmethod
    def create(kind, owner, number, balance=0):

        kind = kind.lower()

        if kind == "savings":
            return SavingsAccount(owner, number, balance)

        elif kind == "current":
            return CurrentAccount(owner, number, balance)

        else:
            raise ValueError("Unknown account type.")

# Create observers
sms = SMSAlert()
audit = AuditLog()

# Create accounts using Factory
savings = AccountFactory.create(
    "savings",
    "Aytenew",
    "10010001",
    5000
)

current = AccountFactory.create(
    "current",
    "Ayele",
    "20020002",
    3000
)

# Subscribe observers
savings.subscribe(sms)
savings.subscribe(audit)

current.subscribe(sms)
current.subscribe(audit)

# Savings
print("===== Savings Account =====")
savings.statement()

savings.deposit(1000)

savings.withdraw(500)

savings.add_interest()

savings.statement()

# Current
print("\n===== Current Account =====")

current.statement()

current.withdraw(3500)

current.statement()

# Singleton demonstration
config1 = BankConfig()
config2 = BankConfig()

print("\nSingleton Test")
print(config1 is config2)        
# account.py

# Custom Exception
class BalanceException(Exception):
    pass


# Observer
class SMSAlert:
    def update(self, message):
        print(f"SMS Alert: {message}")


class AlertService:
    @staticmethod
    def attach(account):
        account.subscribe(SMSAlert())


# Base Account
class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance
        self._observers = []
        self.history = []   # Transaction history stack

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

        # Save transaction
        self.history.append({
            "type": "deposit",
            "amount": amount
        })

        self._notify(
            f"{self.owner} deposited {amount:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than zero.")

        if amount > self.balance:
            raise BalanceException("Insufficient balance.")

        self._balance -= amount

        # Save transaction
        self.history.append({
            "type": "withdraw",
            "amount": amount
        })

        self._notify(
            f"{self.owner} withdrew {amount:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )

    def undo_last(self):
        if not self.history:
            print("No transactions to undo.")
            return

        last = self.history.pop()

        if last["type"] == "deposit":
            self._balance -= last["amount"]

        elif last["type"] == "withdraw":
            self._balance += last["amount"]

        self._notify(
            f"Undo {last['type']} of {last['amount']:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )


# Savings Account
class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0, interest_rate=0.02):
        super().__init__(owner, account_number, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        interest = self.balance * self.interest_rate
        self._balance += interest

        self._notify(
            f"Interest added: {interest:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )


# Current Account
class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0, overdraft_limit=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be greater than zero.")

        if amount > self.balance + self.overdraft_limit:
            raise BalanceException("Overdraft limit exceeded.")

        self._balance -= amount

        self.history.append({"type": "withdraw","amount": amount})

        self._notify(
            f"{self.owner} withdrew {amount:.2f} ETB. "
            f"Balance: {self.balance:.2f} ETB"
        )


# Factory Pattern
class AccountFactory:

    @staticmethod
    def create(kind, owner, account_number, balance=0):

        kind = kind.lower()

        if kind == "savings":
            return SavingsAccount(owner, account_number, balance)

        elif kind == "current":
            return CurrentAccount(owner, account_number, balance)

        else:
            raise ValueError("Unknown account type.")

# Account Registry
class AccountRegistry:

    def __init__(self):
        self.accounts = {}

    def add(self, account):
        if account.account_number in self.accounts:
            raise ValueError("Account number already exists.")

        self.accounts[account.account_number] = account

    def find(self, account_number):
        return self.accounts.get(account_number)

    def list_all(self):
        return sorted(
            self.accounts.values(),
            key=lambda account: account.account_number
        )


# Main 
registry = AccountRegistry()

# Create accounts
savings = AccountFactory.create("savings", "Aytenew","1001",1500)

current = AccountFactory.create("current","Aytenew","1002",2000)

# Attach observers
AlertService.attach(savings)
AlertService.attach(current)

# Add to registry
registry.add(savings)
registry.add(current)

# Transactions
savings.deposit(500)
savings.withdraw(200)
savings.add_interest()

current.withdraw(2500)

# Find account
print("\nFind Account")
account = registry.find("1001")
print(account.owner, account.balance)

# Undo last transaction
print("\nUndo Last Transaction")
account.undo_last()

# List all accounts
print("\nAll Accounts")
for acc in registry.list_all():
    print(
        acc.account_number,
        acc.owner,
        f"{acc.balance:.2f} ETB"
    )
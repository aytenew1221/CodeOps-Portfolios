class BalanceException(Exception):
   pass


class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []
        self.history = []

    @property
    def balance(self):
        return self.__balance

    def _update_balance(self, amount):
        self.__balance += amount

    def subscribe(self, observer):
        self._observers.append(observer)

    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be greater than zero.")

        self._update_balance(amount)
        self.history.append(("deposit", amount))
        self._notify(f"{amount:.2f} ETB deposited into {self.owner}'s account.")

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal must be greater than zero.")

        if amount > self.balance:
            raise BalanceException("Insufficient balance.")

        self._update_balance(-amount)
        self.history.append(("withdraw", amount))
        self._notify(f"{amount:.2f} ETB withdrawn from {self.owner}'s account.")

    def undo_last(self):
        if not self.history:
            print("No transactions to undo.")
            return

        transaction, amount = self.history.pop()

        if transaction == "deposit":
            self._update_balance(-amount)

        elif transaction == "withdraw":
            self._update_balance(amount)

        self._notify(
            f"Last transaction ({transaction} {amount:.2f} ETB) has been undone."
        )

    def statement(self):
        print("\n========== Account Statement ==========")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.balance:.2f} ETB")


# Savings Account
class SavingsAccount(Account):
    pass

# Current Account
class CurrentAccount(Account):
    pass

# Factory Pattern
class AccountFactory:
    @staticmethod
    def create(account_type, owner, account_number, balance=0):
        if account_type.lower() == "savings":
            return SavingsAccount(owner, account_number, balance)

        elif account_type.lower() == "current":
            return CurrentAccount(owner, account_number, balance)

        else:
            raise ValueError("Invalid account type.")


# Observer Pattern
class SMSAlert:
    def update(self, message):
        print(f"SMS Alert: {message}")


class AuditLog:
    def update(self, message):
        print(f"Audit Log: {message}")


# Registry Pattern
class AccountRegistry:
    def __init__(self):
        self.accounts = {}
        self.order = []

    def add(self, account):
        if account.account_number in self.accounts:
            raise ValueError("Account already exists.")

        self.accounts[account.account_number] = account
        self.order.append(account)

    def find(self, account_number):
        return self.accounts.get(account_number)

    def list_all(self):
        return self.order

# Main Program
if __name__ == "__main__":

    sms = SMSAlert()
    audit = AuditLog()

    savings = AccountFactory.create(
        "savings", "Aytenew", "10010001", 5000
    )

    current = AccountFactory.create(
        "current", "Ayele", "20020002", 3000
    )

    # Subscribe observers
    savings.subscribe(audit)

    current.subscribe(sms)
    current.subscribe(audit)

    # Create registry
    registry = AccountRegistry()

    # Add accounts
    registry.add(savings)
    registry.add(current)

    # Find account
    acc = registry.find("10010001")

    if acc:
        acc.statement()

    # List all accounts
    print("\nAll Accounts")
    for account in registry.list_all():
        print(
            account.owner,
            account.account_number,
            f"{account.balance:.2f} ETB"
        )

    # Test deposit
    savings.deposit(1000)

    print("\nBalance before undo:", savings.balance)

    savings.undo_last()

    print("Balance after undo:", savings.balance)
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
#inheretance
class SavingsAccount(Account):
    def __init__(self, owner, balance=0, interest_rate=0.02):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate
#saving account has a method to add interest to the balance
    def add_interest(self):
        self.balance += self.balance * self.interest_rate
s = SavingsAccount("Almaz", 1500)
s.deposit(500)#inherited
print(s.balance)  


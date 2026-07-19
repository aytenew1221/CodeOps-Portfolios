
# Classes and Objects

class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        print(f'"{self.title}" by {self.author} - {self.pages} pages')


book1 = Book("Python Basics", "John Smith", 250)
book2 = Book("Learning Git", "Sarah Brown", 180)

print("1. Book Class")
book1.describe()
book2.describe()

print("\n" + "=" * 40)

# ------------------------------------------
# 2, 3 & 4. Product Class
# ------------------------------------------

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity      # Private attribute

    @property
    def quantity(self):
        """Getter for quantity."""
        return self.__quantity

    @quantity.setter
    def quantity(self, value):
        """Setter that prevents negative quantities."""
        if value >= 0:
            self.__quantity = value
        else:
            print("Quantity cannot be negative.")

    def restock(self, n):
        self.__quantity += n
        print(f"{self.name} restocked by {n}.")

    def sell(self, n):
        if n <= self.__quantity:
            self.__quantity -= n
            print(f"{n} {self.name}(s) sold.")
        else:
            print("Not enough stock available.")

    def display(self):
        print(f"{self.name} | Price: {self.price} ETB | Quantity: {self.quantity}")


# ------------------------------------------
# Create Products
# ------------------------------------------

product1 = Product("Paracetamol", 50, 20)
product2 = Product("Bandage", 15, 30)
product3 = Product("Vitamin C", 80, 10)

print("2. Product Class")
product1.display()
product2.display()
product3.display()

print("\nRestocking Paracetamol...")
product1.restock(5)

print("Selling 8 Paracetamol...")
product1.sell(8)

product1.display()

print("\n" + "=" * 40)

# ------------------------------------------
# 4. Validation
# ------------------------------------------

print("4. Validation Example")

print("Trying to sell more than available...")
product3.sell(20)

print("\nTrying to set quantity to -5...")
product2.quantity = -5

print("\nCurrent Products:")
product1.display()
product2.display()
product3.display()

print("\n" + "=" * 40)

# ------------------------------------------
# 5. Prove Independence
# ------------------------------------------

print("5. Prove Independence")

print("\nSelling 5 Bandages...")
product2.sell(5)

print("\nProduct 1")
product1.display()

print("Product 2")
product2.display()

print("Product 3")
product3.display()
from abc import ABC, abstractmethod
import math

#  Single Responsibility Principle (SRP)

print("=" * 50)
print("1. Single Responsibility Principle (SRP)")
print("=" * 50)


class Report:
    """Responsible only for creating the report."""

    def __init__(self, content):
        self.content = content

    def generate(self):
        return f"Report Content:\n{self.content}"


class ReportSaver:
    """Responsible only for saving reports."""

    def save(self, report):
        print("Saving report...")
        print(report.generate())


class ReportEmailer:
    """Responsible only for emailing reports."""

    def send(self, report, email):
        print(f"Sending report to {email}...")
        print(report.generate())


report = Report("Monthly Sales Report")
saver = ReportSaver()
emailer = ReportEmailer()

saver.save(report)
emailer.send(report, "aytenew@gmail.com")

#  Open/Closed Principle (OCP)


print("2. Open/Closed Principle (OCP)")



class Shape(ABC):

    @abstractmethod
    def area(self):
        pass


class Circle(Shape):

    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Square(Shape):

    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


class Triangle(Shape):

    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height


shapes = [
    Circle(5),
    Square(4),
    Triangle(6, 3)
]

for shape in shapes:
    print(f"{shape.__class__.__name__} Area = {shape.area():.2f}")


# 3. Singleton Pattern


print("3. Singleton Pattern")
print("=" * 50)


class AppSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance


settings1 = AppSettings()
settings2 = AppSettings()

print("Currency:", settings1.currency)
print("Same object?", settings1 is settings2)


# 4. Factory Pattern



print("4. Factory Pattern")



class ShapeFactory:

    @staticmethod
    def create(kind, *args):

        kind = kind.lower()

        if kind == "circle":
            return Circle(*args)

        elif kind == "square":
            return Square(*args)

        elif kind == "triangle":
            return Triangle(*args)

        else:
            raise ValueError("Unknown shape type.")


shape1 = ShapeFactory.create("circle", 7)
shape2 = ShapeFactory.create("square", 5)
shape3 = ShapeFactory.create("triangle", 8, 4)

print(type(shape1).__name__, "Area =", round(shape1.area(), 2))
print(type(shape2).__name__, "Area =", round(shape2.area(), 2))
print(type(shape3).__name__, "Area =", round(shape3.area(), 2))


# 5. Observer Pattern



print("5. Observer Pattern")



class NewsAgency:

    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def unsubscribe(self, subscriber):
        self.subscribers.remove(subscriber)

    def notify(self, news):
        for subscriber in self.subscribers:
            subscriber.update(news)


class EmailSubscriber:

    def update(self, news):
        print(f"Email Subscriber received: {news}")


class SMSSubscriber:

    def update(self, news):
        print(f"SMS Subscriber received: {news}")


agency = NewsAgency()

email_sub = EmailSubscriber()
sms_sub = SMSSubscriber()

agency.subscribe(email_sub)
agency.subscribe(sms_sub)

agency.notify("Breaking New:  Nothing ")
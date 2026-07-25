# Recursion, Searching & Sorting 

import random



# 1. Recursive Sum and Count Down

def total(nums):
    """Recursively calculate the sum of a list."""
    if not nums:
        return 0
    return nums[0] + total(nums[1:])


def count_down(n):
    """Recursively print numbers from n to 1."""
    if n <= 0:
        return
    print(n)
    count_down(n - 1)


print("========== 1. Recursive Functions ==========")

numbers = [10, 20, 30, 40, 50]
print("Numbers:", numbers)
print("Total:", total(numbers))

print("\nCount Down:")
count_down(5)


# 2. Binary Search

def binary_search(items, target):
    """Return the index of target in a sorted list or -1."""
    left = 0
    right = len(items) - 1

    while left <= right:
        mid = (left + right) // 2

        if items[mid] == target:
            return mid
        elif items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


print("\n========== 2. Binary Search ==========")

balances = [500, 1000, 1500, 2000, 2500, 3000]

print("Balances:", balances)
print("Search for 2000:", binary_search(balances, 2000))
print("Search for 1700:", binary_search(balances, 1700))

# 3. Merge Sort


def merge(left, right):
    """Merge two sorted lists."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result


def merge_sort(items):
    """Sort a list using merge sort."""
    if len(items) <= 1:
        return items

    middle = len(items) // 2

    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])

    return merge(left, right)


print("\n========== 3. Merge Sort ==========")

random_list = [random.randint(1, 100) for _ in range(10)]

print("Original:", random_list)

sorted_list = merge_sort(random_list)

print("Merge Sort:", sorted_list)
print("Built-in Sorted:", sorted(random_list))
print("Match:", sorted_list == sorted(random_list))


# 4. Sort with a Key

accounts = [
    ("Abebe", 1500),
    ("Sara", 3200),
    ("Kebede", 900),
    ("Hana", 2500),
    ("Dawit", 4000)
]

sorted_accounts = sorted(
    accounts,
    key=lambda account: account[1],
    reverse=True
)

print("\n========== 4. Sort with Key ==========")

print("Accounts sorted by balance (highest first):")

for name, balance in sorted_accounts:
    print(f"{name}: {balance} ETB")


# 5. Two Pointers

def has_pair(nums, target):
    """Return True if two numbers sum to target."""
    left = 0
    right = len(nums) - 1

    while left < right:
        current = nums[left] + nums[right]

        if current == target:
            return True
        elif current < target:
            left += 1
        else:
            right -= 1

    return False


print("\n========== 5. Two Pointers ==========")

numbers = [2, 4, 7, 11, 15, 20, 24]

print("Numbers:", numbers)
print("Target 26:", has_pair(numbers, 26))   # 11 + 15
print("Target 18:", has_pair(numbers, 18))   # False

# Data Structures: BST, Trees, Graphs, Heap

from collections import deque
import heapq



#  Binary Search Tree (BST)


print("=" * 50)
print("1. Binary Search Tree (BST)")
print("=" * 50)


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    """Insert a value into the BST."""
    if root is None:
        return Node(value)

    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)

    return root


def inorder(root):
    """Print values in sorted order."""
    if root:
        inorder(root.left)
        print(root.value)
        inorder(root.right)


balances = [1200, 500, 2000, 750, 300, 1500, 2500]

root = None
for balance in balances:
    root = insert(root, balance)

print("Balances in sorted order:")
inorder(root)


#  Tree Height (Depth)


print("\n" + "=" * 50)
print("2. Tree Height")
print("=" * 50)


def height(node):
    """Return the height of the tree."""
    if node is None:
        return 0

    left_height = height(node.left)
    right_height = height(node.right)

    return 1 + max(left_height, right_height)


print("Tree Height:", height(root))

#  Breadth-First Search (BFS)


print("\n" + "=" * 50)
print("3. Breadth-First Search (BFS)")
print("=" * 50)

graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": ["F"],
    "F": []
}


def bfs(graph, start):
    visited = set()
    queue = deque([start])

    while queue:
        vertex = queue.popleft()

        if vertex not in visited:
            visited.add(vertex)

            for neighbor in graph[vertex]:
                if neighbor not in visited:
                    queue.append(neighbor)

    return visited


reachable = bfs(graph, "A")
print("Reachable vertices:", reachable)

#  Depth-First Search (DFS)


print("\n" + "=" * 50)
print("4. Depth-First Search (DFS)")
print("=" * 50)


def dfs(graph, start, visited=None):
    if visited is None:
        visited = []

    visited.append(start)

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited


print("DFS Visit Order:", dfs(graph, "A"))

print("\nComparison:")
print("BFS explores level by level.")
print("DFS explores as deep as possible before backtracking.")



#  Priority Queue (Heap)


print("\n" + "=" * 50)
print("5. Priority Queue")
print("=" * 50)

tasks = []

heapq.heappush(tasks, (3, "Generate Report"))
heapq.heappush(tasks, (1, "Fix Critical Bug"))
heapq.heappush(tasks, (5, "Team Meeting"))
heapq.heappush(tasks, (2, "Reply Emails"))
heapq.heappush(tasks, (4, "Update Documentation"))

print("Tasks by priority:")

while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"Priority {priority}: {task}")
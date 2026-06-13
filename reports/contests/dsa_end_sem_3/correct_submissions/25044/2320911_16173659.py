'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    def solve(root, k):
        if not root:
            return 0
        if root.val == k:
            return 1 + solve(root.left, k) + solve(root.right, k)
        return solve(root.left, k) + solve(root.right, k)
    return solve(root, k)
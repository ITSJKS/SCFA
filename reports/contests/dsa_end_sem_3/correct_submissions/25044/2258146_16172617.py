'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if not root:
        return 0

    val = 1 if root.val == k else 0
    return val + count_frequency(root.left, k) + count_frequency(root.right, k)
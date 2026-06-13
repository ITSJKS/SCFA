'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0
    def f(root):
        nonlocal count
        if root == None:
            return 0
        if root.val == k:
            count += 1
        f(root.left)
        f(root.right)
    f(root)
    return count
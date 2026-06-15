'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0
    def f(node):
        nonlocal count
        if node == None:
            return 0
        if node.val == k:
            count+=1
        f(node.left)
        f(node.right)
    f(root)
    return count
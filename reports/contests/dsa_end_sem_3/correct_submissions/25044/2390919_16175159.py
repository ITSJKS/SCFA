'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    c = 0
    def count(node, v):
        nonlocal c
        if node == None:
            return
        if node.val == v:
            c += 1
        count(node.left, v)
        count(node.right, v)
    
    count(root, k)
    return c
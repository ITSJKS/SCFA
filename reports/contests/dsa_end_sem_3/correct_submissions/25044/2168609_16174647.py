'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    c = [0]
    def inorder(node):
        if node is None:
            return 
        inorder(node.left)
        if node.val == k:
            c[0] += 1
        inorder(node.right)
    inorder(root)
    return c[0]
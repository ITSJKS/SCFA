'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    def count(node):
        if not node:
            return 0
        if node.val==k:
            return 1 + count(node.left) + count(node.right)
        else:
            return count(node.left) + count(node.right)
    return count(root)
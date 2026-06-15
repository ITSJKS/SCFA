'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    def count(node):
        if node==None:
            return 0

        left=count(node.left)
        right=count(node.right)
        if node.val==k:
            return left+right+1
        return left+right
    return count(root)
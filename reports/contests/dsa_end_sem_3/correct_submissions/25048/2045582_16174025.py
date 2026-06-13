'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    def total(node):
        if not node:
            return 0
        return node.val + total(node.left) + total(node.right)
    def leaf(node):
        if not node:
            return 0
        if not node.left and not node.right:
            return node.val
        else:
            return leaf(node.left) + leaf(node.right)
    if not root or (root.left==None and root.right==None):
        return 0
    return total(root)-leaf(root)-root.val
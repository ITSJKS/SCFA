'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    def summer(root):
        if root is None:
            return 0
        if root.left is None and root.right is None:
            return 0
        else:
            return root.val + summer(root.left) + summer(root.right)
    return summer(root.left)+summer(root.right)
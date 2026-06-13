'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    ts = [0]
    ls = [root.val]
    if root.left is None and root.right is None:
        return 0
    def inorder(node):
        if node is None:
            return 
        inorder(node.left)
        ts[0] += node.val
        if node.left is None and node.right is None:
            ls[0] += node.val
        inorder(node.right)

    inorder(root)
    return ts[0] - ls[0]
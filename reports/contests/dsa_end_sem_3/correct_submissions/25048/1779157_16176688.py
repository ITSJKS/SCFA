'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    s = 0
    ls = 0
    if root.left == None and root.right == None:
        return 0
    def alls(node):
        nonlocal s
        if node == None:
            return 0
        s+=node.val
        alls(node.left)
        alls(node.right)
    alls(root)
    def leafs(node):
        nonlocal ls
        if node == None:
            return 0 
        if node.left == None and node.right == None:
            ls += node.val
        leafs(node.left)
        leafs(node.right)
    leafs(root)
    return s-(ls+root.val)
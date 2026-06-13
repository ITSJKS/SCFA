'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def summ(root):
    if root==None:
        return 0
    elif root.left==None and root.right==None:
        return 0

    left = summ(root.left)
    right = summ(root.right)

    return root.val + left + right

def InnerSum(root):
    temp = root

    if root==None or (root.left == None and root.right==None):
        return 0

    return summ(root) - temp.val
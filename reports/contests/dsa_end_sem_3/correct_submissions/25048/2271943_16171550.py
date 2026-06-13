'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if(root.left==None and root.right==None):
        return 0 
    def f(root):
        if root==None:
            return 0 
        if not root.left and not root.right:
            return 0 
        return f(root.left) + f(root.right) + root.val 
    return f(root)-root.val
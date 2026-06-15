'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    if root.left==None and root.right==None:
        return 0
    def f(root):
        if root==None:
            return 0
        if root.left==None and root.right==None:
            return 0
        
        return root.val + f(root.left) + f(root.right)
    
    return f(root)-root.val
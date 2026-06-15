'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    add =0
    curr=root
    if root.left==root.right==None:
        return add
    def f(root):
        nonlocal add
        if root == None:
            return
        if root.left!=None or root.right!=None:
            
            add += root.val
        f(root.left)
        f(root.right)
    f(curr)
    add -=root.val
    return add
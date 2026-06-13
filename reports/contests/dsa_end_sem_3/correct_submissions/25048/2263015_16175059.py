'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    if(root.right==None and root.left==None):
        return 0
    f=root.val
    def c(root):
        if(root==None):
            return 0
        if(root.right==None and root.left==None):
            return 0
        return c(root.right)+c(root.left)+root.val
    a=c(root)
    return a-f
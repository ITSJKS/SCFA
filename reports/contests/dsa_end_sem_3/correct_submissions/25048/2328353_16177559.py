'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    def fxn(root):
        if root == None:
            return 0
        if root.left==None and root.right==None :
            return 0
        return root.val + fxn(root.left) + fxn(root.right)
    if root.left==None and root.right==None:
        return 0
    return fxn(root) - root.val
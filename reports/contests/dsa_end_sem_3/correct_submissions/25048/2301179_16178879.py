'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    l=[0]
    k=root.val
    if root.left==None and root.right==None:
        return 0 
    def f(root):
        if root==None:
            return 0 
        if root.left==None and root.right==None:
            l[0]+=0
        elif (root.left!=None and root.right!=None) or (root.left!=None and root.right==None) or (root.left==None and root.right!=None):
            l[0]+=root.val
        f(root.left)
        f(root.right)
    f(root)
    return l[0]-k
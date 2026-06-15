'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    l=root.val
    if N==1:
        return 0
    s=[0]
    def f(root):
        if root==None:
            return
        if root.left==None and root.right==None:
            return
        
        s[0]+=root.val
        f(root.left)
        f(root.right)
    f(root)
    return s[0]-l
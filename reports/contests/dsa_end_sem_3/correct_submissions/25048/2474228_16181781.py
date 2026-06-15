'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    l=[]
    def f(root):
        if not root:
            return 
        l.append(root.val)
        f(root.right)
        f(root.left)
    f(root)
    a=sum(l)
    leaf=[]
    def f1(root):
        if not root:
            return 
        if(root.left==None and root.right==None):
            leaf.append(root.val)
        f1(root.right)
        f1(root.left)
    f1(root)
    b=sum(leaf)
    c=root.val
    if(a==b):
        return 0
    else:
        return a-b-c
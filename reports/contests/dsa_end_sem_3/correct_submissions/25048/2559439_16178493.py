'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    l=[]
    def s(root,l):
        if root==None:
            return 
        if root.left==None and root.right==None:
            return
        else:
            l.append(root.val)
        s(root.left,l)
        s(root.right,l)
    s(root,l)
    if len(l)>1:
        return sum(l)-l[0]
    else:
        return 0
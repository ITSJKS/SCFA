'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    l=[]
    s=[]
    if root.left==None and root.right==None:
        return 0

    def trav(root):
        if root==None:
            return 
        if root.left==None and root.right==None:
            l.append(root.val)
        else:
            s.append(root.val)
        trav(root.left)
        trav(root.right)
    trav(root)
    return (sum(s)-root.val)
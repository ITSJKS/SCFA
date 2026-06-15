'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if root.val==None:
        return None
    if root.left==None and root.right==None:
        return 0
    a=[]
    b=[]
    return (sum(ans(root,a)))-(sum(ans2(root,b))+root.val)
    
def ans(root,a):
    if root==None:
        return a
    ans(root.left,a)
    a.append(root.val)
    
    ans(root.right,a)
    return a
    
def ans2(root,a):
    if root==None:
        return a
    if root.left is None and root.right is None:
        a.append(root.val)
    
    
    ans2(root.left,a)
    ans2(root.right,a)
    return a
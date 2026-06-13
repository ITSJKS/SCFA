'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    l=[]
    def f(h):
        if h==None:
            return
        f(h.left)
        f(h.right)
        if h==root:
            x=0
        elif h.left==None and h.right==None:
            x=0
        else:
            l.append(h.val)
    f(root)
    return sum(l)
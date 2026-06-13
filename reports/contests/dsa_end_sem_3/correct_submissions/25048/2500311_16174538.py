'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if not(root) or not(root.left or root.right): return 0
    k = root.val
    def f(r=root):
        if not(r) or not(r.left or r.right): return 0
        return r.val + f(r.right) + f(r.left)
    s = f()
    return s-k
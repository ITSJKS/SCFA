'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    s=0
    def f(x):
        nonlocal s
        if x==None:
            return 0
        if x.val==k:
            s+=1
        f(x.left)
        f(x.right)
    f(root)
    return s
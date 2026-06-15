'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    l=[]
    def f(root):
        if root==None:
            return
        
        f(root.left)
        f(root.right)
        l.append(root.val)
    f(root)
    return l.count(k)
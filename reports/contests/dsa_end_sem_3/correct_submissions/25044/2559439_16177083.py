'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    l=[]
    def c(root,l):
        if root==None:
            return
        if root.val==k:
            l.append(root.val)
        c(root.left,l)
        c(root.right,l)
    c(root,l)
    return len(l)
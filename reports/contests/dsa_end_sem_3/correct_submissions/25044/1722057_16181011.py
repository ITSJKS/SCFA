'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if root== None:
        return 0
    a=[]
    return (ans(root,a)).count(k)
    

def ans(root,a):
    if root==None:
        return a
    a.append(root.val)
    ans(root.left,a)
    ans(root.right,a)
    return a
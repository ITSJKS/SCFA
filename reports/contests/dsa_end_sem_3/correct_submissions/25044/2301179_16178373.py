'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    l=[0]
    def f(root):
        if root==None:
            return 0
        if root.val==k:
            l[0]+=1
        f(root.left)
        f(root.right)
    f(root)
    return l[0]
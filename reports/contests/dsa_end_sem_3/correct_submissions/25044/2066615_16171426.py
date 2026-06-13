'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count=0
    def helper(root,k):
        nonlocal count
        if root==None:
            return
        elif root.val==k:
            count+=1
        helper(root.left,k)
        helper(root.right,k)
    helper(root,k) 
    return count
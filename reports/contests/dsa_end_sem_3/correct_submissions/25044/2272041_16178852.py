'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if root==None:
        return 0
    c=0
    if root.val==k:
        c=1
    return c+count_frequency(root.left, k)+count_frequency(root.right,k)
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    x=0
    if root==None:
        return 0
    if root.val==k:
        x+=1
    l=count_frequency(root.left,k)
    r=count_frequency(root.right,k)
    return l+r+x
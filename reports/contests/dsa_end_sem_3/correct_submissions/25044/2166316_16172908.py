'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if not root:
        return 0
    c=0

    l=count_frequency(root.left,k)
    r=count_frequency(root.right,k)
    if root.val==k:
        c+=1
    return l + r + c
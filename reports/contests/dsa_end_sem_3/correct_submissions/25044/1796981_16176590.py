'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    if root is None :
        return 0
    if root.val==k:
        count=1
    else:
        count=0
    return count + count_frequency(root.left,k) + count_frequency(root.right,k)
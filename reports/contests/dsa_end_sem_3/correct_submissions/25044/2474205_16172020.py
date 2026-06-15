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
    ans= count_frequency(root.left,k)+count_frequency(root.right,k)
    if root.val==k:
        return ans+1
    return ans
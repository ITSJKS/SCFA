'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if not(root): return 0
    return int(root.val==k) + count_frequency(root.left,k) + count_frequency(root.right,k)
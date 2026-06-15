'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    count=0
    if root is None: return 0
    for i in level_order:
        if i==k: count+=1
    return count
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0
    if root is None:
        return 0
    left = count_frequency(root.left, k)
    right = count_frequency(root.right, k)
    if root.val == k:
        count = 1
    return (count + left + right)
    # write your code here
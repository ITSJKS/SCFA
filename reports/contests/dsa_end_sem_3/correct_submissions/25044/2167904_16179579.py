'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if root == None:
        return 0
    left = count_frequency(root.left, k)
    right = count_frequency(root.right, k)
    if(root.val == k):
        return left + right + 1
    return left + right
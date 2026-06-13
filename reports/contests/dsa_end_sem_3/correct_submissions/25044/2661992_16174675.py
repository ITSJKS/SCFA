'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    c=0
    def helper(root):
        nonlocal c
        if not root:
            return
        if root.val==k:
            # print('hey')
            c+=1
        helper(root.left)
        helper(root.right)
    helper(root)
    return c
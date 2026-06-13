'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    sum = [0]
    if root.left is None and root.right is None:
        return 0
    def f(root):

        if root is None:
            return 

        if root.left is None and root.right is None:
            return

        sum[0] += root.val

        left = f(root.left)
        right = f(root.right)
    
    f(root)
    return sum[0] - root.val
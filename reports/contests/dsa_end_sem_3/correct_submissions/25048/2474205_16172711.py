'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    if root is None:
        return 0
    def helper(root):
        if root==None:
            return 0
        if root.left==None and root.right==None:
            return 0
        return helper(root.left)+helper(root.right)+root.val
    return helper(root.left)+helper(root.right)
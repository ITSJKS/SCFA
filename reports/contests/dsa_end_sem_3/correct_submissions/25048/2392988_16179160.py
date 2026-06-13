'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''


def hehe(root):
    if root == None:
        return 0
    if root.left == None and root.right == None:
        return 0
    return root.val + hehe(root.right) + hehe(root.left) 
def InnerSum(root):
    return hehe(root.right) + hehe(root.left)
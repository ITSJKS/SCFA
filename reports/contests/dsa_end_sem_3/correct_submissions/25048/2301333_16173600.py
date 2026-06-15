'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    summ = 0
    if root.left == None and root.right == None:
        return 0
    def f(root):
        nonlocal summ
        if root == None:
            return 0
        elif root.left == None and root.right == None:
            return 0
        # elif (root.left == None and root.right != None) or (root.left != None and root.right == None):
        #     return 0
        else:
            summ += root.val
        f(root.left)
        f(root.right)
    f(root)
    return summ-root.val
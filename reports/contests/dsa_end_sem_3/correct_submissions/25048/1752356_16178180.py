'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    if not root:
        return 0
    
    if not root.left and not root.right:
        return 0




    res = [0, 0]
    def f(node):
        if not node:
            return

        if node:
            res[0] += node.val

        f(node.left)
        f(node.right)

    f(root)

    def f(node):
        if not node:
            return

        if node.left == None and node.right == None:
            res[1] += node.val

        f(node.right)
        f(node.left)

    f(root)

    return res[0] - res[1] - root.val
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    def left(root):
        if root == None:
            return 0 
        if root.left == None and root.right==None:
            return 0
        return (left(root.right)+left(root.left)+root.val)
    def right(root):
        if root == None:
            return 0 
        if root.left == None and root.right==None:
            return 0
        return (right(root.right)+right(root.left)+root.val)
    return left(root.left) + right(root.right)

    # if root == None:
    #     return 0 
    # if root.left == None and root.right==None:
    #     return 0
    # return (InnerSum(root.right)+InnerSum(root.left)+root.val)
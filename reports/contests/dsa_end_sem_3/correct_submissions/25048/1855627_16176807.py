'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''
c=0
def InnerSum(root,i=0):
    #write your code here
    global c
    if i == 0:
        root.val= 0
    if not root:
        return 0

    if root.left == None and root.right == None:
        return 0
    

    return root.val + InnerSum(root.left,1) + InnerSum(root.right,1)
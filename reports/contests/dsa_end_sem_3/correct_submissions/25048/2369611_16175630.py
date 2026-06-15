'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    if root.left == None and root.right == None :
        return 0
    head = root.val
    rootsum = [0]
    tsum = [0]
    def f(root):
        if root ==None:
            return 0
        if root.left == None and root.right == None:
            rootsum[0] +=root.val
        tsum[0]+=root.val
        f(root.left)
        f(root.right)
    f(root)
    return tsum[0]-rootsum[0]-head
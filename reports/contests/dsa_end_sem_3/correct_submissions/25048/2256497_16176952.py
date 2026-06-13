'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    l=[0]
    if not root.left and not root.right:
        return 0
    def fun(root):
        if not root:
            return
        if root.left!=None or root.right!=None:
            l[0]+=root.val
        fun(root.left)
        fun(root.right)
    fun(root)
    return l[0]-root.val
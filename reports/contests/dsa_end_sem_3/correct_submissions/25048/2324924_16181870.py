'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if root ==None or (root.left==None and root.right==None):
        return 0
    # if root.left==0:
    #     return 
    def abc(root1):
        if root1==None or (root1.left==None and root1.right==None):
            return 0
        left=abc(root1.left)
        right=abc(root1.right)
        return (root1.val+left+right)
    k=abc(root)
    return (k-root.val)
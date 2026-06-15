'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if (root.left==None and root.right==None) :
            return 0
    #write your code here
    l=[0]
    def f(node):
        if node==None:
            return 
        f(node.left)
        f(node.right)
        if (node.left and node.right) or (node.left ) or (node.right ) :
            l[0]+=node.val
        
    f(root)
    return l[0]-root.val
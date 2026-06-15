'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    a = root.val
    L = []
    def f(node,L):
        if node==None:
            return 0
        if node.left!=None or node.right!=None :
            L.append(node.val)
        f(node.left,L)
        f(node.right,L)
    f(root,L)
    if L:
        return sum(L)-a
    else:
        return 0
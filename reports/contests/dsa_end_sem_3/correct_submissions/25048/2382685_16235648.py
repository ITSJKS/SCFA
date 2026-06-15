'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''
def InnerSum(root):
    d=[]
    def solve(node):
        if node==None:
            return
        if node != root and not (node.left is None and node.right is None):
            d.append(node.val)
        solve(node.left)
        solve(node.right)
    solve(root)
    return sum(d)
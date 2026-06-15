'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    sumi = 0
    def dfs(node):
        nonlocal sumi 
        if node is None:
            return None
        dfs(node.left)
        if node.left is not None or node.right is not None:
            sumi += node.val
        dfs(node.right)
    dfs(root)
    if sumi != 0:
        return sumi - root.val
    else:
        return sumi
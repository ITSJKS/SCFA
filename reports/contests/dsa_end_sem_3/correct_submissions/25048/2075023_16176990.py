'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    r = root.val
    lst = []
    leaf = []
    if root.left is None and root.right is None:
        return 0
    if root is None:
        return None
    def traverse(node):
        if node is None:
            return 
        if node.left is None and node.right is None:
            leaf.append(node.val)
        
        traverse(node.left)
        traverse(node.right)
        lst.append(node.val)

        
    traverse(root)
    return sum(lst) - sum(leaf) - r
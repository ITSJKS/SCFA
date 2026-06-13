'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    def tree(node):
        if node is None:
            return 0
        if (node.left==None and node.right==None):
            return 0
        return tree(node.left)+tree(node.right)+node.val
    return tree(root.left)+tree(root.right)
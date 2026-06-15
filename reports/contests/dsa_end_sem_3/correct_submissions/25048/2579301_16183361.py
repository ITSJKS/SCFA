'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    
    result = []

    def pre(node):
        
        if node == None:
            return

        # skip root and skip leaf nodes
        if node != root and (node.left != None or node.right != None):
            result.append(node.val)

        pre(node.left)
        pre(node.right)

    pre(root)

    return sum(result)
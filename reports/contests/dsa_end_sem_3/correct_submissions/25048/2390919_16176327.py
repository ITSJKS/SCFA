'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    sum1 = 0

    def inner(node, a):
        nonlocal sum1

        if node == None or (node.left == None and node.right == None):
            return
        
        if node != a:
            sum1 += node.val
        inner(node.left, a)
        inner(node.right, a)
    
    inner(root, root)
    
    return sum1
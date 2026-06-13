'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''
sum = 0
def InnerSum(root):
    def traverse(node):
        global sum
        if not node:
            return
        
        if not node.left and not node.right:
            return
        
        sum += node.val
        traverse(node.left)
        traverse(node.right)
    
    traverse(root.left)
    traverse(root.right)
    return sum
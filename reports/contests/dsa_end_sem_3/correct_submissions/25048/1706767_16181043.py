'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    ans =[0]
    rem = [0]

    def traverse(node):
        if node == None:
            return
    
        if node.left == None and node.right == None:
            rem[0] += 1
        else:
            ans[0] += node.val
        
        traverse(node.left)
        traverse(node.right)
    
    traverse(root)
    
    if root.left == None and root.right == None:
        return 0
    else:
        return ans[0] - root.val
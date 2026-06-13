'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    ans = []
    def preorder(node):
        if node is None:
            return
        if node!= root:
            if (node.left != None or node.right !=None):
                ans.append(node.val) 
        preorder(node.left)
        preorder(node.right)
        return sum(ans)
    return preorder(root)
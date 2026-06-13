'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    sumi=[0]
    def find(node):
        if node==None:
            return 
        if node.left!=None or node.right!=None:
            sumi[0]+=node.val
        find(node.left)
        find(node.right)
    find(root)
    if sumi[0]==0:
        return 0
    return sumi[0]-root.val
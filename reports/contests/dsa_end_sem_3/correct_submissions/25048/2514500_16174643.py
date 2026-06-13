'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    ans=[]
    def inn(node):
        if(node==None):
            return
        inn(node.left)
        if(node!=root and (node.right!=None or node.left!=None)):
            ans.append(node.val)
        inn(node.right)
    inn(root)
    return sum(ans)
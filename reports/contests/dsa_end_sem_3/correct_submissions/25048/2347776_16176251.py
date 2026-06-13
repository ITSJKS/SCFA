'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    l = []
    def helper(root):
        if root==None:
            return []
        if (root.left != None or root.right!=None):
            l.append(root.val)    
        
        helper(root.left)
        helper(root.right)
    helper(root)    
    return (sum(l[1:])) 




    # temp = root.val
    # print(temp)
    # c=0
    # if root == None:
    #     return 0
    # if (root.left == None and root.right==None):
    #     c+=0
    # else:
    #     c+=root.val
    # return c + InnerSum(root.right)+InnerSum(root.left)
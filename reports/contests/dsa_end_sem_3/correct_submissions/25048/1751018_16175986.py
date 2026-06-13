'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(roo):
    # L = [1]
    # print(L)
    # L.append(1)
    if roo.left == None and roo.right == None:
        return 0
   

    def rec(root,prev=0):
        if root == None:
            return 0
        if root.left== None and root.right == None:
            return 0

        return rec(root.left)+rec(root.right)+root.val



    return rec(roo.left)+rec(roo.right)
    #write your code here
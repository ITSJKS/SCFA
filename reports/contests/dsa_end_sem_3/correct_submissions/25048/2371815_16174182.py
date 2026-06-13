'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    def f(root):
        ans=0
        if(not root):
            return 0
        if(root.left or root.right):
            ans=root.val
        else:
            return 0
        return f(root.left)+f(root.right)+ans
    return(f(root.left)+f(root.right))
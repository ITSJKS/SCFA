'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    global l
    global c
    if root==None:
        return 0
    if root.left==None and root.right==None:return 0
    c=0
    l=[root.val]
    def hello(node):
        global l
        global c
        if node==None:
            return 
        c+=node.val
        if node.left==None and node.right==None:
            l.append(node.val)
        hello(node.left)
        hello(node.right)
    hello(root)
    return c-sum(l)
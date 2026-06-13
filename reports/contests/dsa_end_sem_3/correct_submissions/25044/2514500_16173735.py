'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    ans=[]
    def inn(node):
        if(node==None):
            return 
        inn(node.left)
        ans.append(node.val)
        inn(node.right)
    inn(root)
    c=0
    for i in ans:
        if(i==k):
            c+=1
    return c
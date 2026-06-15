'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    l=[0]
    # write your code here
    def f(node):
        if node==None:
            return 
        f(node.left)
        f(node.right)
        if node.val==k:
            l[0]+=1
    f(root)
    return l[0]
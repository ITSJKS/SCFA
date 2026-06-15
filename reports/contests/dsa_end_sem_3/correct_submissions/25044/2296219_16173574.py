'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    global c
    c=0
    def hello(node):
        global c
        if node==None:
            return 
        if node.val==k:
            c+=1
        hello(node.left)
        hello(node.right)
    hello(root)
    return c
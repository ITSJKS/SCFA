'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    
    ct=[0]
    def find(node):
        if node==None:
            return
        if node.val==k:
            ct[0]+=1
        find(node.left)
        find(node.right)
    find(root)
    
    return ct[0]
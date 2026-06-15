'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    def tree(node):
        c=0
        if node is None:
            return 0
        if node.val==k:
            c+=1
        l=tree(node.left)
        r=tree(node.right)
        return l+r+c
    return tree(root)
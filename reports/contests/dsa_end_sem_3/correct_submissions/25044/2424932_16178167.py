'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count=0
    def h(node,k):
        nonlocal count
        if node is None:
            return 
        if node is not None and node.val==k:
            count+=1
        # if node.left and node.val==k:
        #     count+=1
        # if node.right and node.val==k:
        #     count+=1
        h(node.left,k)
        h(node.right,k)
    h(root,k)
    return count
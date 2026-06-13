'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0
    def dfs(node,k):
        nonlocal count
        if node == None:
            return
        if node.val==k:
            count +=1
        
        dfs(node.left,k)
        dfs(node.right,k)

    dfs(root,k)
    return count
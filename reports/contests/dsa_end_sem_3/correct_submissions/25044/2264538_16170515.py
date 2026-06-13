'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0

    def traverse(node):
        if not node:
            return
        
        if node.val == k:
            nonlocal count 
            
            count += 1
        
        traverse(node.left)
        traverse(node.right)
    
    traverse(root)
    return count
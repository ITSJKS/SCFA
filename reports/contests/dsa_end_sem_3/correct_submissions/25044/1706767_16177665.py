'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    ans =[0]

    def traverse(node):
        if node == None:
            return 

        if node.val == k:
            ans[0] += 1
        
        traverse(node.left)
        traverse(node.right)
    
    traverse(root)
    return ans[0]
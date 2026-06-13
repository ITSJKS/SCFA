'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    ans = []
    def preorder(node):
        if node is None:
            return 0
        if node.val == k:
            ans.append(node.val)
        preorder(node.left)
        preorder(node.right)
        return len(ans)
    return preorder(root)
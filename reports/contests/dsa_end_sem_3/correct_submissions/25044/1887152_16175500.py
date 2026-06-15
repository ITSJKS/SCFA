'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    if root == None:
        return 0
    # elif root.left == None and root.right == None:
    #     if root.val == k:
    #         return root.val
    #     else:
    #         return 0
    arr = []
    def inOrder(node, arr, x):
        if node == None:
            return None
        inOrder(node.left, arr, x)
        if node.val == x:
            arr.append(node.val)
        inOrder(node.right,arr, x)
        return arr
    return inOrder(root, arr, k).count(k)
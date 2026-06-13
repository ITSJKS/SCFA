'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    cnt = [0]
    def f(root):
        if root is None:
            return 
        
        if root.val == k:
            cnt[0] += 1
        
        left = f(root.left)
        right = f(root.right)
        
    f(root)
    return cnt[0]
    # write your code here
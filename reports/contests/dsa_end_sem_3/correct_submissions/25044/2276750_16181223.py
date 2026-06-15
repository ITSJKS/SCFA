'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    arr=[]
    def f(root):
        if root:
            f(root.left)
            arr.append(root.val)
            f(root.right)
    f(root)
    
    return(arr.count(k))
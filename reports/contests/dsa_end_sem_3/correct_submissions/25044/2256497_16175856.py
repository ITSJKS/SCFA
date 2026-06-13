'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    l=[0]
    def fun(root):
        if not root:
            return
        if root.val==k:
            l[0]+=1
        fun(root.left)
        fun(root.right)
    fun(root)
    return l[0]
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    count = 0
    def fun(root1,k):
        nonlocal count
        if root1==None:
            return -1
        if root1.val==k:
            count+=1
        fun(root1.left,k)
        fun(root1.right,k)
    fun(root,k)
    return count
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):

    def rec(roo,k):
        if roo == None:
            return 0

        elif roo.val == k:
            return rec(roo.left,k)+rec(roo.right,k)+1

        else:
            return rec(roo.left,k)+rec(roo.right,k)

    return rec(root,k)
    # write your code here
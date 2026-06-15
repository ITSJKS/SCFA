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
    
    count=0
    if root.val ==k:
        count+=1
    left=count_frequency(root.left,k)
    right=count_frequency(root.right,k)

    return count + left + right
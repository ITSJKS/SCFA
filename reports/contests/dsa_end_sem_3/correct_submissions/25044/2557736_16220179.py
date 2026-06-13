'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if root==None:
        return 0
    count = 0
    if root.val==k:
        count = 1
    
    ls = count_frequency(root.left, k)
    rs = count_frequency(root.right, k)
    return  count + ls + rs




    # write your code here
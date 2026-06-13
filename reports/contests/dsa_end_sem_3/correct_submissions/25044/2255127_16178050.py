'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    if root is None:
        return 0
    count=0
    if root.val==k:
        count+=1
    return count_frequency(root.left,k)+count+count_frequency(root.right,k)
    
    
    # write your code here
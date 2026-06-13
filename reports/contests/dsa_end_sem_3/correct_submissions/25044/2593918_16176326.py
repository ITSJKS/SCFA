'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(node, k):
    # write your code here
    #rough 
    if node== None:
        return 0


    if node.val == k:
        n =1
    else:
        n = 0




    if node.left:
        left = count_frequency(node.left , k)
    else:
        left = 0 


    if node.right:
        right = count_frequency(node.right , k)
    else:
        right = 0


    return left + right + n
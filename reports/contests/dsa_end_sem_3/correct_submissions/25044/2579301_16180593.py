'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    count = []
    def pre(node):
        if node==None:
            return None
        pre(node.left)
        count.append(node.val)
        # if node.val==k:
        #     count+=1
        pre(node.right)
    pre(root)
    result = 0
    for i in count:
        if i==k:
            result+=1
    return result
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    ans=[]
    def f(node,val):
        if not node:
            return 

        f(node.left,val)
        if node.val==k:
            ans.append(1)
        f(node.right,val)

    f(root,k)
    return sum(ans)
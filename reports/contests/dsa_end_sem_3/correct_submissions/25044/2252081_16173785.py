'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    ans = [0]
    def f(root,k):
        if(not root):
            return
        if(root.val==k):
            ans[0]+=1
        f(root.left,k)
        f(root.right,k)
    f(root,k)
    return ans[0]
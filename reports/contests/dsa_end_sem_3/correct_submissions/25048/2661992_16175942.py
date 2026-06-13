'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if not root.left and not root.right:
        return 0

    ans=0
    def helper(root):
        nonlocal ans
        if not root:
            return
        if not root.left and not root.right:
            return
        ans+=root.val
        helper(root.left)
        helper(root.right)
    helper(root)
    return ans-root.val
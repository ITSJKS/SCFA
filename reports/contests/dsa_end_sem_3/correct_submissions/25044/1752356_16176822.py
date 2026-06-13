'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    # write your code here
    ans = [0]
    def f(node):
        if not node:
            return

        if node.val == k:
            ans[0] += 1

        f(node.left)
        f(node.right)

    f(root)
    return ans[0]
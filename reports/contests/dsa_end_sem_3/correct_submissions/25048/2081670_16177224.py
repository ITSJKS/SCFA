'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    k = root.val
    # sum = 0-k
    ans = []
    def dfs(node):
        # nonlocal sum 

        if node==None:
            return
        if node.left==None and node.right==None:
            return
        
        # sum += node.val
        ans.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return sum(ans[1:])
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    ans = []
    s = 0
    def rec(node):
        if node is None:
            return 0
        
        if (node.left != None or node.right != None):
            ans.append(node.val)
        rec(node.left)
        rec(node.right)
    
    rec(root)
    if len(ans) == 0:
        return 0
    for i in ans:
        s += i
    final = s - root.val
    return final
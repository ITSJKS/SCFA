'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    # if root != None:
    #     return None
    l = []
    def solve(node):
        if node is None:
            return None
        if not node.left and not node.right:
            return None
        
        l.append(node.val)
        left = solve(node.left)
        right = solve(node.right)
        # l.append(node.val)
    solve(root)
    # return l
    summ = 0

    for i in range(1 , len(l)):
        summ += l[i]
    return summ
        


    # if root is None:
    #     return 0 
    # if not root.left and not root.right:
    #     return 0
    # left = InnerSum(root.left)
    # right = InnerSum(root.right)
    # return ( root.val + left + right)
    # #write your code here
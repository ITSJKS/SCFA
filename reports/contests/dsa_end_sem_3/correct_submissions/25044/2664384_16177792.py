class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def count_frequency(root, k):
    # write your code here
    # ans=[]
    # c=0
    # def trav(node):
    #     # nonlocal c
    #     if root==None:
    #         return
    #     ans.append(node.val)
    #     trav(node.right)
    #     trav(node.left)
    # trav(root)
    # # if k in ans:
    # #     c=c+1
    # return ans
    l=[]
    c=0

    def trav(node):
        if node==None:
            return 
        
        
        l.append(node.val)
        trav(node.left)
        trav(node.right)
    trav(root)
    for i in range(len(l)):
        if l[i]==k:
            c=c+1
    return c
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def InnerSum(root):
    #write your code here
    
    # l=[]
    # def trav(node):
    #     if node==None:
    #         return 
        
    #     if node.left==None and node.right==None:
    #         l.append(node.val)
    #     trav(node.left)
    #     trav(node.right)
    # trav(root)
    ans=[]

    def trav1(node):
        if node==None or( node.left==None and node.right==None) :
            return 
        
        if node!=root:
            ans.append(node.val)
        trav1(node.left)
        trav1(node.right)
    trav1(root)
    


    # ans.pop(0)
    
    
    return sum(ans)
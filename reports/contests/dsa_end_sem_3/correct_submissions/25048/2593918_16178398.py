'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    #write your code here
    



    def abc(node):



        left = right = 0
        if node.left:
            left =  abc(node.left)

        if node.right:
            right = abc(node.right)    


        if not(node.left or node.right):
            return 0
  
         

        return left + right + node.val 

    if root.left or root.right:
        n = root.val
    else:
        n = 0
    return abc(root) - n
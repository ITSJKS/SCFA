'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    l=[]
    def f(root):
        if not root:
            return
        l.append(root.val)
        f(root.left)
        f(root.right)
    f(root)
    count=0
    for i in range(len(l)):
        if(l[i]==k):
            count+=1
    return count
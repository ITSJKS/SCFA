'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def count_frequency(root, k):
    lst = []
    def fn(no, k):
        if no == None:
            return 
        lst.append(no.val)
        fn(no.left, k)
        fn(no.right, k)
    fn(root, k)
    count = 0
    for i in lst:
        if i ==k:
            count+=1
    return count
    # if root == None:
    #     return count
    # c = 0
    # if root.val ==k:
    #     c +=1
    # count_frequency(left.root,k)
    # count_frequency(right.root,k)
    # return count
'''
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
'''

def InnerSum(root):
    if root.left == None and root.right == None:
        return 0
    def leafNodes(root):
        arr = []
        def preOrder(node):
            if node == None:
                return 
            if node.left == None and node.right == None:
                arr.append(node.val)
            preOrder(node.left)
            preOrder(node.right)
            return arr
        return preOrder(root)
    def allNodes(root):
        arr = []
        def preOrder(node):
            if node == None:
                return 
            arr.append(node.val)
            preOrder(node.left)
            preOrder(node.right)
            return arr
        return preOrder(root)
    ori = allNodes(root)
    leafs = leafNodes(root)
    ori.remove(root.val)
    for i in range(len(leafs)):
        ori.remove(leafs[i])
    return sum(ori)
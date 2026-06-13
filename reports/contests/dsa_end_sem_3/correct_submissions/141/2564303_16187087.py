'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    curr = head
    prev = None
    front = head

    while front is not None:

        front = front.next
        curr.next = prev
        prev = curr
        curr = front 
    return prev
    

    # curr = head
    # l = []
    # l1 = []
    # # while curr.next:
    # #     curr = curr.next
    # # l.append(curr.data)
    
    # while curr.next:
    #     l1.append(curr.data)
    #     curr = curr.next
    # # l1.append(l[0])
    # l1.append(curr.data)
    # for i in range(len(l1) - 1 , -1 , -1):
    #     print(l1[i] , end = " ")

    # while curr and curr.next:
    #     l.append(curr.data)
    #     curr = curr.next
        
    # # print(l)





    # l = []
    # def solve(node):
    #     if node is None:
    #         return None
    #     l.append(node.val)
    #     left =  solve(node.left)
    #     right =  solve(node.right)
    # solve(head)
    # return l
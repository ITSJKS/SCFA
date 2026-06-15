'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):

    temp = head
    prev = temp
    dummy = Node(0)
    dum = dummy

    while temp != None:
        curr = temp.next
        temp.next = dum
        dum = temp
        temp = curr
    
    prev.next = None
    return dum
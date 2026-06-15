'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = None
    curr = head
    nextn = curr

    while curr != None:
        nextn = curr.next
        curr.next = prev
        prev = curr
        curr = nextn
    
    return prev
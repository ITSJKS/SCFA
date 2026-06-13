'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = None
    curr = head
    agla = None
    while curr is not None:
        agla = curr.next
        curr.next = prev
        prev = curr
        curr = agla
    return prev
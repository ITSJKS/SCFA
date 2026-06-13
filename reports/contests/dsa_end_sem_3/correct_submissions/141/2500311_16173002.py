'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    p = None
    c = head
    while c:
        n = c.next
        c.next = p
        p = c
        c = n
    return p
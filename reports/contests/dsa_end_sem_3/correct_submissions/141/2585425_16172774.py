'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    h=head
    prv=None
    while h!=None:
        nxt=h.next
        h.next=prv
        prv=h
        h=nxt
    return prv
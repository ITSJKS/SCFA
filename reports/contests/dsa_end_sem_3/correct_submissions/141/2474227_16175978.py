'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    curr =head
    prew = None
    while curr:
        nst = curr.next
        curr.next =prew
        prew = curr
        curr = nst
    return prew
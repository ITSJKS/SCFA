'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=None
    curr=head
    nextnode=None
    while curr:
        nextnode=curr.next
        curr.next=prev
        prev=curr
        curr=nextnode
    return prev
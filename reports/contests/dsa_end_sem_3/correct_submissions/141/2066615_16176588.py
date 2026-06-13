'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=None
    curr=head
    while curr.next!=None:
        after=curr.next
        curr.next=prev
        prev=curr
        curr=after
    curr.next=prev

    return curr
'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
        prev=None
        curr=head
        while curr:
            nn=curr.next
            curr.next=prev
            prev=curr
            curr=nn
        return prev
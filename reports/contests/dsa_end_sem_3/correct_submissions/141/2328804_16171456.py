'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=None
    while head:
        temp=head.next
        head.next=prev
        prev=head
        head=temp
    head=prev
    return head
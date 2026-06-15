'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if not head : return head
    curr=head
    nxt,prev=None,None
    while curr.next!=None:
        nxt=curr.next
        curr.next=prev
        prev=curr
        curr=nxt
    curr.next=prev
    return curr
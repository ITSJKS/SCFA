class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None

def reverseLL(head):
    prev=None
    cur=head
    nxt=None
    while cur!=None:
        nxt=cur.next
        cur.next=prev
        prev=cur
        cur=nxt

    return prev
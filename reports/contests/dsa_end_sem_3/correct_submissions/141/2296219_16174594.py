'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=None
    t=head
    cur=head
    c=head
    while t:
        t=cur.next
        cur.next=prev
        prev=cur
        c=cur
        cur=t
    return c
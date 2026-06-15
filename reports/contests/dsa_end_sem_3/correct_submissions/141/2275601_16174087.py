'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=None
    cur=head
    while cur!=None:
        front=cur.next
        cur.next=prev
        prev=cur
        cur=front
    return prev
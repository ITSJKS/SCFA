'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if n==1:
        return head
    prev=None
    curr=head
    while curr:
        curr.next,prev,curr=prev,curr,curr.next
    return prev
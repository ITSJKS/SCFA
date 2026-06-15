'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev=Node(0)
    curr=head
    if head.next:
        n=curr.next
    else:
        return head
    while curr and curr.next:
        curr.next=prev
        prev=curr
        curr=n
        if n.next:
            n=n.next
        else:
            curr.next=prev
            prev=curr
            break
    head.next=None
    return curr
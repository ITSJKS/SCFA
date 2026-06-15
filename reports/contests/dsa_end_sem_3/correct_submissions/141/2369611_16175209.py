'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head is None or head.next is None:
        return head
    prev = None
    while head:
        t = head.next
        head.next = prev
        prev = head
        head = t
    return prev
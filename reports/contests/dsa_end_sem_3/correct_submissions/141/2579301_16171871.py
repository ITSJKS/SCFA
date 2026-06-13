'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head==None:
        return None
    if head.next==None:
        return head
    prev = None
    curr = head
    while curr!=None:
        front=curr.next
        curr.next = prev
        prev = curr
        curr = front
    return prev
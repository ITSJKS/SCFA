'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head is None:
        return 
    prev = None
    curr = head

    while curr!=None:
        front = curr.next
        curr.next = prev
        prev = curr
        curr = front

    return prev
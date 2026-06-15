'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = None
    curr = head
    while curr.next:
        front = curr.next
        curr.next = prev
        prev = curr
        curr = front
    
    curr.next = prev
    return curr
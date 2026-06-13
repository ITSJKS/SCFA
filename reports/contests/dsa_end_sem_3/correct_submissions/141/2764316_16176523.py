'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head == None:
        return None

    curr = head
    prev = None
    while curr:
        new = curr.next
        curr.next = prev
        prev = curr
        curr = new

    return prev
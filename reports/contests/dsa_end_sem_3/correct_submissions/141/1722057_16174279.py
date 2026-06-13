'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    p = None
    curr = head
    while curr:
        temp = curr.next
        curr.next = p
        p = curr
        curr = temp
    return p
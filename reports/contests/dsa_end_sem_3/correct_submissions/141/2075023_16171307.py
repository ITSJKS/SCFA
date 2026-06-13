'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    if head is None:
        return None
    
    prev = None
    curr = head

    while curr:
        next_node = curr.next
        curr.next = prev

        prev = curr
        curr = next_node

    return prev
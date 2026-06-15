'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = None
    curr = head

    while curr!=None:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    
    return prev
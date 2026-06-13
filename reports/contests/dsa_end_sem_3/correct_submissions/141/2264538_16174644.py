'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    prev = head
    curr = head.next
    prev.next = None
    while curr:
        temp = curr.next
        curr.next = prev
        prev = curr
        curr = temp
        
    
    return prev
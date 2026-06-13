'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    dummy = Node(0)
    dummy.next = head
    curr = head 
    prev = None
    while curr:
        temp = curr
        curr = curr.next
        temp.next = prev
        prev = temp
    
    return prev
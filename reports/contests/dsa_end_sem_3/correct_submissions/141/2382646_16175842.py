'''
    class Node:
        def __init__(self, data):   # data -> value stored in node
            self.data = data
            self.next = None
'''
def reverseLL(head):
    
    current = head 
    prev = None
        

    while current is not None:

        front = current.next 
        current.next = prev 
        prev = current
        current = front 

    return prev